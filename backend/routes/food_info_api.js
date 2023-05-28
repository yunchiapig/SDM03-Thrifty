const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const multerS3 = require('multer-s3')
const { s3Client, deleteImage } = require('./utilities/aws_s3');
require('dotenv').config();

// 引入 FoodInfo model
const FoodInfo = require('../model/food_info');

// 引入 StoreInfo model
const StoreInfo = require('../model/store_info');

// 引入 JWT verify middleware function
const { JWTValidate } = require('./utilities/jwt_validation');

// 引入檢查格式的 middleware function
const {checkID, checkFoodInfo} = require('./utilities/format_check');

// s3 multer 相關設定
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      const ext = file.mimetype.split('/')[1];
      const key = `img-${Date.now()}.${ext}`;
      cb(null, key);
    }
  }),

  // 檢查檔案格式
  fileFilter: function(req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支援的檔案類型. 僅支援 JPEG, PNG.'));
    }
  },

  // 限制檔案大小
  // limits: { fileSize: 1024 * 1024 * 30 } // 30 MB files
})


// 讀取食物品項資訊
router.get('/', checkID, async function(req, res, next) {
  
  // 取得食物品項 ID
  const foodID = req.query.id;

  try{
    const foodInfo = await FoodInfo.findById(foodID).select('-__v').lean();

    // 查無食物品項資訊
    if (foodInfo === null ){
      res.status(400).send(
        {message: "查無食物品項資訊"}
      );
      return;
    }

    res.send(
      {data: foodInfo}
    );

  } catch(error) {
    console.log(error);
    res.status(500).send(
      {message: "Internal Server Error!"}
    );
  }
});


// 建立食物品項資訊
router.post('/', 
  JWTValidate,
  upload.fields([
    {name: 'img_url', maxCount: 1},
  ]),
  checkFoodInfo, 
  async function(req, res, next) {
    //console.log(req.body);
    const storeID = req.body.storeID;
    const updateInfo = req.body.updateInfo;
    const foodInfo = new FoodInfo({
      name: updateInfo.name,
      category: updateInfo.category,
      tag: updateInfo.tag,
      original_price: updateInfo.original_price,
      discount_price: updateInfo.discount_price,
      description: updateInfo.description,
      img_url : `https://sdm03-thrifty.s3.ap-northeast-1.amazonaws.com/${req.files.img_url[0].key}`,
    });

    try{
      // 檢查店家是否存在
      const storeExists = await StoreInfo.exists({ _id: storeID });
      if (!storeExists) {
        // 刪除剛剛上傳的主要圖片
        deleteImage(updateInfo.img_url );

        res.status(400).send({message: "店家不存在。"});
        return;
      }

      // 取得店家的庫存資訊
      const stockIds = await StoreInfo.findOne({ _id: storeID })
      .select('stocks._id')
      .lean() // return plain JavaScript objects to get better performance
      .then(store => store.stocks.map(stock => stock._id));

      // 檢查食物品項是否已存在
      const foodExists = await FoodInfo.exists({ _id: {$in: stockIds}, name: updateInfo.name });
      if (foodExists) {
        // 刪除剛剛上傳的主要圖片
        deleteImage(updateInfo.img_url );
        
        res.status(400).send({message: "食物品項已存在。"});
        return;
      }

      // 建立食物品項資訊
      const newFoodInfo = await foodInfo.save();
      const foodID = newFoodInfo._id;

      // 將食物品項 ID 加入店家 stock 中
      const stockUpdateResult = await StoreInfo.findByIdAndUpdate(
        storeID, 
        {$push: {stocks: {_id: foodID, quantity: 0}}}
      );

      res.send(
        {data: newFoodInfo}
      );
    } catch(error) {
      console.log(error);
      res.status(500).send(
        {message: "Internal Server Error!"}
      );
    }
});


// 更新食物品項資訊
router.put('/',
  JWTValidate,
  upload.fields([
    {name: 'img_url', maxCount: 1},
  ]),
  checkFoodInfo,
  async function(req, res, next) {
    // 取得食物品項 ID
    const foodID = req.body.foodID;

    // 取得更新資訊
    const updateInfo = req.body.updateInfo;

    try{
      // 更新主要圖片
      if (req.files.img_url ) {
        updateInfo.img_url  =`https://sdm03-thrifty.s3.ap-northeast-1.amazonaws.com/${req.files.img_url[0].key}`;
        
        // 刪除舊的主要圖片
        const oldImg_url  = await FoodInfo.findById(foodID).select('img_url  -_id').lean();
        if (!oldImg_url) {

          // 刪除剛剛上傳的主要圖片
          deleteImage(updateInfo.img_url );

          res.status(400).send(
            {message: "查無店家資訊"}
          );
          return;
        }

        deleteImage(oldImg_url.img_url );
      }

      // 透過 ID 更新食物品項資訊
      const options = {new: true}
      const updateResult = await FoodInfo.findByIdAndUpdate(foodID, updateInfo, options);
      // console.log(updateResult);

      // 查無食物品項資訊
      if (updateResult === null ){
        res.status(400).send(
          {message: "查無食物品項資訊"}
        );
        return;
      }

      res.send(
        {data: updateResult}
      );

    } catch(error) {
      console.log(error);
      res.status(500).send(
        {message: "Internal Server Error!"}
      );
    }
});


// 刪除食物品項資訊
router.delete('/', JWTValidate, async function(req, res, next) {
  // 取得食物品項 ID
  console.log(req.query);
  const foodID = new mongoose.Types.ObjectId(req.query.foodID);
  const storeID = req.query.storeID;

  try{
    // 刪除舊的主要圖片
    const oldImgUrl = await FoodInfo.findById(foodID).select('img_url  -_id').lean();
    deleteImage(oldImgUrl.img_url ); 
    
    // 透過 ID 刪除食物品項資訊
    const deleteResult = await FoodInfo.findByIdAndDelete(foodID);
    // console.log(deleteResult);

    // 查無食物品項資訊
    if (deleteResult === null ){
      res.status(400).send(
        {message: "查無食物品項資訊"}
      );
      return;
    }

    // 將食物品項 ID 從店家 stock 中移除
    const stockDeleteResult = await StoreInfo.findByIdAndUpdate(
      storeID,
      {$pull: {stocks: {_id: foodID}}},
      {new: true} // to return the modified document
    );

    // 查無該項商品庫存
    if (stockDeleteResult === null ){
      res.status(400).send(
        {message: "查無該項商品庫存"}
      );
      return;
    }

    res.send(
      {message: "刪除食物品項成功"}
    );

  } catch(error) {
    console.log(error);
    res.status(500).send(
      {message: "Internal Server Error!"}
    );
  }
});

module.exports = router

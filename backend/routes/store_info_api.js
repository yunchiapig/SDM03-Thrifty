const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3')
const { s3Client, deleteImage } = require('./utilities/aws_s3');
require('dotenv').config();
const axios = require('axios');

// 引入 StoreInfo model
const StoreInfo = require('../model/store_info');

// 引入 JWT verify middleware function
const { JWTValidate } = require('./utilities/jwt_validation');

// 引入檢查格式的 middleware function
const {checkStoreInfo, checkID, checkStoreUpdateInfo} = require('./utilities/format_check');

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
  }
})

// 店家地址轉經緯度
async function addressToGeoinfo(address) {
  let data = await (await axios(`https://www.google.com/maps/place?q=${encodeURI(address)}`)).data;
  data = data.toString();
  let pos = data.indexOf('center') + 7;
  data = data.slice(pos, pos + 50);
  const lat = data.slice(0, data.indexOf('%2C'));
  const lng = data.slice(data.indexOf('%2C') + 3, data.indexOf('&amp'));
  return [parseFloat(lng), parseFloat(lat)];
} 


// 讀取店家資訊
router.get('/', checkID, async function(req, res, next) {
  
  //取得店家ID
  const storeID = req.query.id;

  // 透過 ID 查詢店家資訊
  try{
    const storeInfo = await StoreInfo.findById(storeID).select('-__v').lean();

    // 查無店家資訊
    if (storeInfo === null) {
      res.status(400).send(
        {message: "查無店家資訊"}
      );
      return;
    }

    res.send(
      {data: storeInfo}
    );

  } catch(error) {
    console.log(error);
    res.status(500).send(
      {message: "Internal Server Error!"}
    );
  }
});


// 建立店家資訊
router.post('/', 
  upload.fields([
    {name: 'mainpage_img_url', maxCount: 1},
    // {name: 'images'}
  ]),
  checkStoreInfo,
  async function(req, res, next) {
  // console.log(req.body);

  const GetCoordinates = await addressToGeoinfo(req.body.address)
  const location = {
      "type": "Point",
      "coordinates": GetCoordinates
    }

  const storeInfo = new StoreInfo({
    name: req.body.name,
    category: req.body.category,
    tel: req.body.tel,
    address: req.body.address,
    location: location,
    updateDate: Date.now(),
    stocks: [],
    mainpage_img_url: `https://sdm03-thrifty.s3.ap-northeast-1.amazonaws.com/${req.files.mainpage_img_url[0].key}`,
    storepage_img_url: `https://sdm03-thrifty.s3.ap-northeast-1.amazonaws.com/${req.files.mainpage_img_url[0].key}`
    // images: req.files.images ? req.files.images.map(file => file.key) : []
  });

  try{
    const newStoreInfo = await storeInfo.save();
    res.send(
      {data: newStoreInfo}
    );

  } catch(error) {
    console.log(error);
    res.status(500).send(
      {message: "Internal Server Error!"}
    )
  }
});


// 更新店家資訊
router.put('/', 
  JWTValidate, 
  upload.fields([
    {name: 'mainpage_img_url', maxCount: 1},
    // {name: 'images'}
  ]),
  checkStoreUpdateInfo,
  async function(req, res, next) {
    // console.log(req.body);

    // 取得店家ID
    const storeID = req.body.storeID;

    // 取得更新資訊 updateInfo
    let updateInfo = req.updateInfo;

    // 更新日期
    updateInfo.updateDate = Date.now();

    // 更新經緯度
    if (req.body.address) {
      const GetCoordinates = addressToGeoinfo(req.body.address)
      updateInfo.location = GetCoordinates;
    }
    
    // 透過 ID 更新店家資訊
    try {
      // 更新主要圖片
      if (req.files.mainpage_img_url) {
        updateInfo.mainpage_img_url = `https://sdm03-thrifty.s3.ap-northeast-1.amazonaws.com/${req.files.mainpage_img_url[0].key}`
        updateInfo.storepage_img_url = `https://sdm03-thrifty.s3.ap-northeast-1.amazonaws.com/${req.files.mainpage_img_url[0].key}`
        
        // 刪除舊的主要圖片
        const oldMainImageUrl = await StoreInfo.findById(storeID).select('mainpage_img_url -_id').lean();
        if (!oldMainImageUrl) {

          // 刪除剛剛上傳的主要圖片
          deleteImage(updateInfo.mainpage_img_url);

          res.status(400).send(
            {message: "查無店家資訊"}
          );
          return;
        }

        deleteImage(oldMainImageUrl.mainpage_img_url);
      }

      // 更新其他圖片
      // if (req.files.images) {
      //   updateInfo.images = req.files.images.map(file => file.key);
      // }

      // 更新店家資訊
      const options = {new: true}
      const updateResult = await StoreInfo.findByIdAndUpdate(storeID, updateInfo, options);
      // console.log(updateResult);

      // 查無店家資訊
      if (updateResult === null) {
        res.status(400).send(
          {message: "查無店家資訊"}
        );
        return;
      }
      
      res.send(
        {message: '更新店家資訊成功!'}
      );

    } catch(error) {
      console.log(error);
      res.status(500).send(
        {message: "Internal Server Error!"}
      );
    }
});


// 刪除店家資訊
router.delete('/', checkID, async function(req, res, next) {
  // console.log(req.body);

  // 取得店家ID
  const storeID = req.query.id;

  try {
    // 刪除舊的主要圖片
    const oldMainImageUrl = await StoreInfo.findById(storeID).select('mainpage_img_url -_id').lean();
    deleteImage(oldMainImageUrl.mainpage_img_url); 

    // 刪除店家資訊
    const deleteResult = await StoreInfo.findByIdAndDelete(storeID);
    console.log(deleteResult);

    // 查無店家資訊
    if (deleteResult === null) {
      res.status(400).send(
        {message: "查無店家資訊"}
      );
      return;
    }

    //回傳訊息
    res.send(
      {message: '刪除店家資訊成功!'}
    );

  } catch (error) {
    console.log(error);
    res.status(500).send(
      { message:"Internal Server Error!" }
    );
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 引入 FoodInfo model
const FoodInfo = require('../model/food_info');

// 引入 StoreInfo model
const StoreInfo = require('../model/store_info');

// 引入檢查格式的 middleware function
const {checkID, checkFoodPrice} = require('./utilities/format_check');


// 讀取食物品項資訊
router.get('/', checkID, async function(req, res, next) {
  
  // 取得食物品項 ID
  const foodID = req.query.id;

  try{
    const foodInfo = await FoodInfo.findById(foodID).select('-__v');

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
router.post('/', checkFoodPrice, async function(req, res, next) {
  // console.log(req.body);
  const storeID = req.body.storeID;
  const updateInfo = req.body.updateInfo;
  const foodInfo = new FoodInfo({
    name: updateInfo.name,
    category: updateInfo.category,
    tag: updateInfo.tag,
    original_price: updateInfo.original_price,
    discount_price: updateInfo.discount_price,
  });

  try{
    // 建立食物品項資訊
    const newFoodInfo = await foodInfo.save();
    const foodID = newFoodInfo._id;

    // 將食物品項 ID 加入店家 stock 中
    const stockUpdateResult = await StoreInfo.findByIdAndUpdate(
      storeID, 
      {$push: {stocks: {_id: foodID, quantity: 0}}}
    );

    if (stockUpdateResult === null ){
      res.status(400).send(
        {message: "查無該店家"}
      );
      return;
    }

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
router.put('/', checkFoodPrice, async function(req, res, next) {
  // 取得食物品項 ID
  const foodID = req.body.foodID;

  // 取得更新資訊
  const updateInfo = req.body.updateInfo;

  try{
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
router.delete('/', async function(req, res, next) {
  // 取得食物品項 ID
  const foodID = new mongoose.Types.ObjectId(req.query.foodID);
  const storeID = req.query.storeID;

  try{
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

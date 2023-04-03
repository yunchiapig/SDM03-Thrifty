const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {checkID, checkStockUpdateInfo} = require('./utilities/format_check');

// 引入 StoreInfo model
const StoreInfo = require('../model/store_info');
const FoodInfo = require('../model/food_info');

// 取得 Stock 資訊
router.get('/', checkID, async function(req, res, next) {
  const storeID = req.query.id;
  // 先根據 storeID 查詢店家的 stocks 資訊
  const stocksInfo = await StoreInfo.findById(storeID).select('stocks -_id')
  const stocksArray = stocksInfo.stocks;
  // console.log(stocksArray);

  // 檢查 stocksArray 是否為空陣列
  if (stocksArray.length == 0) {
    res.send({message: "目前沒有任何品項，請先新增品項。"})
    return;
  }

  // 識別 stocksArray 使用的 food ID（全家 or Object ID）
  const idType = Object.keys(stocksArray[0])[0]

  try {
    // idType 為全家的 food ID
    if (idType == 'family_pid') {    
      // 透過全家的 food ID 查詢食物品項資訊
      for (let i = 0; i < stocksArray.length; i++) {
        const foodID = stocksArray[i].family_pid
        const foodInfo = await FoodInfo.find({family_pid: foodID}).select('-__v -_id')
        stocksArray[i].foodInfo = foodInfo[0]
      }
    }

    // idType 為 Object ID
    if (idType == '_id') {
      for (let i = 0; i < stocksArray.length; i++) {
        const foodID = stocksArray[i]._id
        const foodInfo = await FoodInfo.find({family_pid: foodID}).select('-__v -_id')
        stocksArray[i].foodInfo = foodInfo[0]
      }
    }

    res.send({data: stocksInfo});

  } catch(error) {
    console.log(error);
    res.status(500).send(
      {message: "Internal Server Error!"}
    );
    return;
  }
});


// 更新 stock 資訊
router.put('/', checkStockUpdateInfo, async function(req, res, next) {
  const storeID = req.body.storeID;
  const foodID = new mongoose.Types.ObjectId(req.body.foodID);
  const updateQty = req.body.updateQty;

  try{
    // 將食物品項的庫存數量更新
    const updatedStore = await StoreInfo.findByIdAndUpdate(
      storeID,
      { $set: { "stocks.$[stock].quantity": updateQty } },
      { arrayFilters: [ { "stock._id": foodID} ], new: true }
    );

    // 檢查是否有正確更新庫存數量
    if (updatedStore === null) {
      res.status(400).send({message: "店家不存在，或是該品項不存在"});
      return;
    }

    res.send({data: updatedStore});

  } catch(error) {
    console.log(error);
    res.status(500).send(
      {message: "Internal Server Error!"}
    );
  }
});

module.exports = router

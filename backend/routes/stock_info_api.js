const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {checkID, checkStockUpdateInfo} = require('./utilities/format_check');
const cors = require('cors');

// 引入 StoreInfo model
const StoreInfo = require('../model/store_info');
const FoodInfo = require('../model/food_info');
router.use(cors());
// 取得 Stock 資訊
router.get('/', checkID, async function(req, res, next) {
  const storeID = req.query.id;
  // 先根據 storeID 查詢店家的 stocks 資訊
  const stocksInfo = await StoreInfo.findById(storeID).select('stocks -_id').lean();
  const stocksArray = stocksInfo.stocks;

  // 檢查 stocksArray 是否為空陣列
  if (stocksArray.length == 0) {
    res.send({message: "目前沒有任何品項，請先新增品項。"})
    return;
  }

  // 識別 stocksArray 使用的 food ID（全家 or Object ID）
  const idType = Object.keys(stocksArray[0])[0]

  try {
    // 根據 food ID 查詢食物品項資訊
    for (let i = 0; i < stocksArray.length; i++) {
      const foodID = stocksArray[i]._id;
      const foodInfo = await FoodInfo.findById(foodID).select('-__v -_id').lean();
      stocksArray[i].foodInfo = foodInfo;
    }

    res.send({data: stocksArray});

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
    // 檢查店家是否存在
    const storeExists = await StoreInfo.exists({ _id: storeID })
    if (!storeExists) {
      res.status(400).send({message: "店家不存在。"});
      return;
    }

    // 檢查食物品項是否存在
    const foodExists = await FoodInfo.exists({ _id: foodID })
    if (!foodExists) {
      res.status(400).send({message: "食物品項不存在。"});
      return;
    }

    // 將食物品項的庫存數量更新
    const updatedStore = await StoreInfo.findByIdAndUpdate(
      storeID,
      { $set: { "stocks.$[stock].quantity": updateQty } },
      { arrayFilters: [ { "stock._id": foodID} ], new: true }
    );

    // 檢查是否有正確更新庫存數量
    // if (updatedStore === null) {
    //   res.status(400).send({message: "店家不存在。"});
    //   return;
    // }

    res.send({data: updatedStore});

  } catch(error) {
    console.log(error);
    res.status(500).send(
      {message: "Internal Server Error!"}
    );
  }
});

module.exports = router

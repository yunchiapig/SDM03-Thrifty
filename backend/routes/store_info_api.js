const express = require('express');
const router = express.Router();

// 引入 StoreInfo model
const StoreInfo = require('../model/store_info');

// 引入檢查格式的 middleware function
const {checkStoreInfo, checkID, checkStoreUpdateInfo} = require('./utilities/format_check');


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
router.post('/', checkStoreInfo, async function(req, res, next) {
  // console.log(req.body);
  const storeInfo = new StoreInfo({
    name: req.body.name,
    category: req.body.category,
    tel: req.body.tel,
    address: req.body.address,
    location: req.body.location,
    updateDate: Date.now(),
    stocks: []
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
router.put('/', checkStoreUpdateInfo, async function(req, res, next) {
  // console.log(req.body);

  // 取得店家ID
  const storeID = req.body.storeID;

  // 取得更新資訊 updateInfo
  const updateInfo = req.updateInfo;
  // console.log(updateInfo);

  try {
    // 透過 ID 更新店家資訊
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
    const deleteResult = await StoreInfo.findByIdAndDelete(storeID);
    // console.log(deleteResult);

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

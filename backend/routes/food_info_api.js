const express = require('express');
const router = express.Router();

// 引入 FoodInfo model
const FoodInfo = require('../model/food_info');

// 引入檢查格式的 middleware function
const {checkID} = require('./utilities/format_check');

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


router.post('/', async function(req, res, next) {
  // console.log(req.body);
  const foodInfo = new FoodInfo({
    name: req.body.name,
    category: req.body.category,
    tag: req.body.tag,
    original_price: req.body.original_price,
    discount_price: req.body.discount_price,
  });

  try{
    const newFoodInfo = await foodInfo.save();
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


router.put('/', async function(req, res, next) {
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


router.delete('/', async function(req, res, next) {
  // 取得食物品項 ID
  const foodID = req.query.id;

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

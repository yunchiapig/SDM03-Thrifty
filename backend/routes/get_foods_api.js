const express = require('express');
const router = express.Router();

// 引入 FoodINfo 和 StoreInfo model
const FoodInfo = require('../model/food_info');
const StoreInfo = require('../model/store_info');

router.get('/', async function (req, res) {
    const { store_id } = req.query;

    try {
      const store_exist = await StoreInfo.findOne({ family_id: store_id })
  
      if(!store_exist) {
          res.status(400).send({ message: "查無店家資訊" });
      } else {
          if (store_exist.stocks.length == 0) {
              res.status(200).send({ message: "店家目前無食物" });
          }
          else {
              var foods = Array()
              for (const stock of store_exist.stocks) {
                  const food_id = stock.family_pid
                  const quantity = stock.quantity
  
                  const food_exist = await FoodInfo.findOne({ family_pid: food_id })
                  if(!food_exist) {
                      res.status(400).send({ message: "查無食物資訊" });
                  } else {
                      foods.push({ food: food_exist, quantity: quantity });
                  }
              }
              res.status(200).send({ message: foods })
          }
      }
    } catch(error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  });

module.exports = router;

const express = require('express');
const router = express.Router();

// 引入 FoodINfo 和 StoreInfo model
const FoodInfo = require('../model/food_info');
const StoreInfo = require('../model/store_info');

// 引入檢查格式的 middleware function
const { checkUserLocation } = require('./utilities/format_check');

router.get('/', checkUserLocation, async function (req, res) {
    const { longitude, latitude } = req.query;
  
    try {
      const store_exist = await StoreInfo.find({
          location: {
              $near: {
                  $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
                  $minDistance: 0, // meters
                  $maxDistance: 1000 // meters
              }
          },
          stocks: { $ne: [] }
        })

      for (const store of store_exist) {
        for (const stock of store.stocks) {
          const food_id = stock._id
          const food_exist = await FoodInfo.findById(food_id)
          if (!food_exist) {
            console.log("Food not found!")
          } else {
            stock.name = food_exist.name
            stock.category = food_exist.category
            stock.discount_price = food_exist.discount_price
          }
        }
      }

      console.log(store_exist.length)
      
      if (store_exist.length == 0) {
        res.status(400).send({ message: "使用者周圍地區無商家" });
      } else {
        res.status(200).send({ message: store_exist })
      }
    } catch(error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
    
  });

module.exports = router;

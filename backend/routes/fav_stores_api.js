const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 引入 UserInfo, StoreInfo 和 FoodInfo model 
const UserInfo = require('../model/user_info');
const StoreInfo = require('../model/store_info');
const FoodInfo = require('../model/food_info');

// 引入 JWT verify middleware function
const { JWTValidate } = require('./utilities/jwt_validation');

// 建立使用者資訊
router.put('/', async function (req, res) {
  // console.log(req.body)
  let ObjectID = mongoose.Types.ObjectId

  try {
    const userID = req.body.userID;
    const storeID = req.body.storeID;
    const type = req.body.type; // add or remove

    if (!ObjectID.isValid(userID) || !ObjectID.isValid(storeID)) {
        res.status(400).send({ message: "userID or storeID is not a valid ObjectID" })
        return
    }

    const user_exist = await UserInfo.findById(userID)
    if (!user_exist) {
        res.status(400).send({ message: "User not found!" })
        return
    }

    const store_exist = await StoreInfo.findById(storeID)
    if (!store_exist) {
        res.status(400).send({ message: "Store not found!" })
        return
    }

    let favorite_stores = user_exist.favorite_stores
    const index = favorite_stores.indexOf(storeID);
    if (type == "add" && index == -1) {
        favorite_stores.push(storeID)
    } else if (type == "remove" && index != -1) {
        favorite_stores.splice(index, 1);
    }

    try {
        const options = {new: true}
        const updateResult = await UserInfo.findByIdAndUpdate(userID, { favorite_stores: favorite_stores }, options)
        const token = await updateResult.generateAuthToken("update")
        res.status(200).send({ message: token })
    } catch(error) {
        console.log(error)
        res.status(400).send({ message: error });
    }
  } catch(error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

router.get('/', async function (req, res) {
    // console.log(req.query)
    let ObjectID = mongoose.Types.ObjectId
  
    try {
      const { userID } = req.query;

      if (!ObjectID.isValid(userID)) {
        res.status(400).send({ message: "userID is not a valid ObjectID" })
        return
      }
      
      const user_exist = await UserInfo.findById(userID)
      if (!user_exist) {
        res.status(400).send({ message: "User not found!" })
        return
      }

      const fav_stores = user_exist.favorite_stores
      let results = new Array()

      for (const storeID of fav_stores) {
        if (!ObjectID.isValid(storeID)) {
            res.status(400).send({ message: "At least a storeID is not a valid ObjectID" })
            return
        }

        const store_exist = await StoreInfo.findById(storeID)
        if (!store_exist) {
            res.status(400).send({ message: "At least a store not found!" })
            return
        }

        for (const stock of store_exist.stocks) {
            const food_id = stock._id
            const food_exist = await FoodInfo.findById(food_id)
            if (!food_exist) {
              console.log("Food not found!")
            } else {
              stock.name = food_exist.name
              stock.category = food_exist.category
              stock.tag = food_exist.tag
              stock.original_price = food_exist.original_price
              stock.discount_price = food_exist.discount_price
              stock.discount_rate = food_exist.discount_rate
              stock.img_url = food_exist.img_url
            }
        }

        results.push(store_exist)
      }
      
      res.status(200).send({ message: results })
    } catch(error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
});

module.exports = router;

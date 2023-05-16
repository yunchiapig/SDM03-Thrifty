const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 引入 UserInfo 和 StoreInfo model 
const UserInfo = require('../model/user_info');
const StoreInfo = require('../model/store_info');

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

module.exports = router;

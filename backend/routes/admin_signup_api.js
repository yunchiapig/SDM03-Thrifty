const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

// 引入檢查格式的 middleware function
const {checkStoreInfo, checkStoreEmailAndPassword} = require('./utilities/format_check');

// 引入 AdminInfo model
const AdminInfo = require('../model/admin_info');

// 引入 StoreInfo model
const StoreInfo = require('../model/store_info');


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


router.post('/', checkStoreInfo, checkStoreEmailAndPassword, async function(req, res, next) {
   // 檢查 content-type
   if (req.headers['content-type'] !== 'application/json'){
    res.status(400).send({errorMessage: `request body 格式須為 'application/json'`})
    return
  }

  // admin 基本資料獲取
  const provider = 'native';
  const email = req.body.email;
  let password = req.body.password;

  // 將密碼加密
  password = await bcrypt.hash(password, 10);

  // 店家地址轉經緯度
  const GetCoordinates = await addressToGeoinfo(req.body.address)
  const location = {
    "type": "Point",
    "coordinates": GetCoordinates
  }

  try{
    // 創建店家資訊
    const storeInfo = new StoreInfo({
      name: req.body.name,
      category: req.body.category,
      tel: req.body.tel,
      address: req.body.address,
      location: location,
      updateDate: Date.now(),
      stocks: [],
      mainpage_img_url: "default",
      storepage_img_url: "defualt"
      // images: req.files.images ? req.files.images.map(file => file.key) : []
    });

    // 取得 storeID
    const newStoreInfo = await storeInfo.save();
    const storeID = newStoreInfo._id;

    // 創建 admin 帳號
    result = await AdminInfo.create({
      email: email,
      password: password,
      provider: provider,
      storeID: storeID
    })

    // 產生 token
    const thriftyAdminJWT = jwt.sign({
      data: {
        'email': email,
        'storeID': storeID
      }
    }, process.env.JWT_ADMIN_SECRECT, { expiresIn: 25200});

    res.send(
      {message: '註冊成功！',
        thriftyAdminJWT: thriftyAdminJWT
      }
    );

  } catch(err) {
    if (err && err.code === 11000) {
      res.status(400).send({message: '此信箱已被註冊過！'});
      return
    }

    console.log(err);
    res.status(500).send({message: 'Internal Server Error!'});
  }
});

module.exports = router;

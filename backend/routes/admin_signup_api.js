const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 引入檢查格式的 middleware function
const {checkStoreInfo, checkStoreEmailAndPassword} = require('./utilities/format_check');

// 引入 AdminInfo model
const AdminInfo = require('../model/admin_info');

// 引入 StoreInfo model
const StoreInfo = require('../model/store_info');

router.post('/', checkStoreInfo, checkStoreEmailAndPassword, async function(req, res, next) {
   // 檢查 content-type
   if (req.headers['content-type'] !== 'application/json'){
    res.status(400).send({errorMessage: `request body 格式須為 'application/json'`})
    return
  }

  // admin 基本資料獲取
  const provider = 'native';
  const email = req.body.email;
  let password = req.body.password

  // 將密碼加密
  password = await bcrypt.hash(password, 10);

  try{
    // 創建店家資訊
    const storeInfo = new StoreInfo({
      name: req.body.name,
      category: req.body.category,
      tel: req.body.tel,
      address: req.body.address,
      location: req.body.location,
      updateDate: Date.now(),
      stocks: []
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
    }, process.env.JWT_ADMIN_SECRECT, { expiresIn: 600});

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

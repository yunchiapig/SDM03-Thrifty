const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWTValidate = require('./utilities/jwt_validation');

// 引入 StoreInfo model
const AdminInfo = require('../model/admin_info');

router.post('/', async function(req, res) {
  // 檢查 content-type
  if (req.headers['content-type'] !== 'application/json'){
    res.status(400).send({message: `request body 格式須為 'application/json'`})
    return
  }

  // admin 基本資料獲取
  const provider = 'native';
  const email = req.body.email;
  let password = req.body.password

  // 從資料庫中讀取密碼
  try {
    const result = await AdminInfo.findOne({email: email});
    
    // 處理信箱尚未註冊的情形
    if (!result){
      res.status(400).send({message: '此信箱尚未註冊！'});
      return
    }

    // 比對密碼
    const DBpassword = result.password;
    const isPassWordValid = await bcrypt.compare(password, DBpassword);

    // 密碼錯誤的情形
    if (!isPassWordValid){
      res.status(400).send({message: '密碼錯誤！'});
      return
    }

    // 產生 token
    const storeID = result.storeID;
    const thriftyAdminJWT = jwt.sign({
      data: {
        'email': email,
        'storeID': storeID
      }
    }, process.env.JWT_ADMIN_SECRECT, { expiresIn: 25200});

    res.send(
      {message: '登入成功！',
        thriftyAdminJWT: thriftyAdminJWT
      }
    );
  } catch(err){
    console.log(err)
    res.status(500).send({message: 'Internal Server Error!'});
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

// 引入 UserInfo model
const UserInfo = require('../model/user_info');

// 引入檢查格式的 middleware function
const { checkUserInfo, checkUserLogin } = require('./utilities/format_check');

// 建立使用者資訊
router.post('/', checkUserInfo, async function (req, res) {
  // console.log(req.body)

  try {
    const name = req.body.name
    const password = req.body.password
    const email = req.body.email

    const exist = await UserInfo.findOne({ email: email })
    if (!exist) {
      const userInfo = new UserInfo({
        name: name,
        password: password,
        email: email
      });
      const token = await userInfo.generateAuthToken("signup")

      res.status(200).send({ message: token })
    } else {
      res.status(400).send({ message: "此 email 已經註冊過" })
    }
  } catch(error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});


// 讀取使用者資訊
router.get('/', checkUserLogin, async function (req, res) {
  // console.log(req.query)

  try {
    const password = req.query.password
    const email = req.query.email

    const user = await UserInfo.findByCredentials(email, password)
    if (user == "email_incorrect" || user == "password_incorrect") {
      res.status(400).send({ message: user })
    } else {
      const token = await user.generateAuthToken("login")
      res.status(200).send({ message: token })
    }
  } catch(error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

module.exports = router;

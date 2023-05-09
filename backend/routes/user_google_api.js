const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');

// 引入 UserInfo model
const UserInfo = require('../model/user_info');

// 讀取使用者資訊
router.post('/', async function (req, res) {
  // console.log(req.body)

  try {
    const client_id = req.body.clientId
    const credential = req.body.credential

    // Call the verifyIdToken to varify and decode it
    const client = new OAuth2Client(client_id)
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: client_id,
    });

    // Get the JSON with all the user info
    const payload = ticket.getPayload();
    const name = payload.name
    const email = payload.email
    const password = "defaultGooglePassword"

    const exist = await UserInfo.findOne({ email: email })
    if (!exist) { // signup
        const userInfo = new UserInfo({
            name: name,
            password: password,
            email: email
        });
        const token = await userInfo.generateAuthToken("signup")

        res.status(200).send({ message: token })
    } else { // login
        const user = await UserInfo.findByCredentials(email, password)
        if (user == "email_incorrect" || user == "password_incorrect") {
            res.status(400).send({ message: user })
        } else {
            const token = await user.generateAuthToken("login")
            res.status(200).send({ message: token })
        }
    }
  } catch(error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

module.exports = router;

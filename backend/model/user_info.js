require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

// 連線到 mongoDB
const connectDB = require('./DB_connection');
connectDB();

// create user info schema
let userInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  favorite_stores: {
    type: Array,
    default: []
  }
});

userInfoSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, Number(process.env.SALTROUNDS))
  }
  next()
})

userInfoSchema.methods.generateAuthToken = async function (type) {
  const user = this
  const payload = {
    name: user.name,
    email: user.email,
    favorite_stores: user.favorite_stores
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY)
  
  if (type=="sign_up") {
    await user.save()
  }

  return token
}

userInfoSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email: email })
  if (!user) {
    return "email_not_found"
  } else {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return "password_not_found"
    } else {
      return user
    }
  }
}

//create food info model
const UserInfo = mongoose.model('user', userInfoSchema, 'user');
module.exports = UserInfo;

const mongoose = require('mongoose');

// 連線到 mongoDB
const connectDB = require('./DB_connection');
connectDB();

// create admin account info schema
let adminInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  storeID: {
    type: String,
    required: true
  }
});

//create food info model
const AdminInfo = mongoose.model('store_admin', adminInfoSchema, 'store_admin');
module.exports = AdminInfo;

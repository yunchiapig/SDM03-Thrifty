const mongoose = require('mongoose');

// 連線到 mongoDB
const connectDB = require('./DB_connection');
connectDB();

// create food info schema
let foodInfoSchema = new mongoose.Schema({
  original_id: {
    type: String,
  },
  brand: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tag: {
    type: String
  },
  original_price: {
    type: Number,
    required: true
  },
  discount_price: {
    type: Number,
    required: true
  },
  discount_rate: {
    type: String,
    // required: true
  },
  description: {
    type: String
  },
  img_url: {
    type: String,
  }
  // images: {
  //   type: Array,
  //   default: []
  // }
});

//create food info model
const FoodInfo = mongoose.model('food', foodInfoSchema, 'food');
module.exports = FoodInfo;

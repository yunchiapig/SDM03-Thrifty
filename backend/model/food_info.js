const mongoose = require('mongoose');

// 連線到 mongoDB
const connectDB = require('./DB_connection');
connectDB();

// create food info schema
let foodInfoSchema = new mongoose.Schema({
  original_id: {
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
  description: {
    type: String
  },
  image: {
    type: String
  }
});

//create food info model
const FoodInfo = mongoose.model('food', foodInfoSchema, 'food');
module.exports = FoodInfo;

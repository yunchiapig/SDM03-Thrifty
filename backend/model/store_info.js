const mongoose = require('mongoose');

// 連線到 mongoDB
const connectDB = require('./DB_connection');
connectDB();

// create store info schema
let storeInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  updateDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  stocks: {
    type: Array,
    default: []
  },
});
storeInfoSchema.index({ location: '2dsphere' });

// create store info model
const StoreInfo = mongoose.model('store', storeInfoSchema, 'store');
module.exports = StoreInfo;

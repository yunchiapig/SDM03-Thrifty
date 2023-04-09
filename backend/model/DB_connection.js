// connect to the mongo altas
require('dotenv').config();
let mongoose = require('mongoose');

// use env variables
const mongoDbUser = process.env.MONGODB_USER
const mongoDbPassword = process.env.MONGODB_PASSWORD

async function connectDB() {
  try{
      // 連線至 mongoDB
      await mongoose.connect( `mongodb+srv://${mongoDbUser}:${mongoDbPassword}@thrifty.0xdedx2.mongodb.net/Thrifty?retryWrites=true&w=majority`);
      //await mongoose.connect( `mongodb+srv://${mongoDbUser}:${mongoDbPassword}@cluster0.4sm1peu.mongodb.net/?retryWrites=true&w=majority`);
      console.log('Connect to MongoDB successfully!');

    } catch(err) {
      console.log(err);
  }
}

module.exports = connectDB;

// db/conn.js
const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config({path:'./LOGIN/src/.env'})



const mongouri = process.env.MONGO_URI;
console.log(mongouri);
const connectDb = async () => {
  try {
    await mongoose.connect(mongouri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDb;

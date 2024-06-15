// db/conn.js
const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config({path:'src/.env'})



const mongouri = process.env.MONGO_URI;
console.log(mongouri);
const connectDb = async () => {
  try {
    await mongoose.connect(mongouri,{
      serverSelectionTimeoutMS: 10000  // Increased timeout to 20 seconds
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDb;

const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: 'src/.env' }); // Assuming your .env file is in src folder

const mongouri = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process on connection failure
  }
};

module.exports = connectDb;

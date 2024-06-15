const mongoose = require('mongoose');
const CenterCapacity = require('../models/CenterCapacity'); // Import the CenterCapacity model

// Connect to MongoDB using async/await
async function connectToMongo() {
  try {
    const connectionString = 'mongodb://127.0.0.1:27017/Login'; // Replace with your Render connection string
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for Capacities');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err; // Re-throw the error to stop execution
  }
}

// Initialize center capacities
const centers = ["Hyderabad", "Secundrabad", "Uppal", "Gachibowli", "Warangal"];
const initialCapacity = 15;

async function initializeCapacities() {
  await connectToMongo(); // Ensure connection before proceeding

  try {
    for (const center of centers) {
      const existingCenter = await CenterCapacity.findOne({ center: center });
      if (!existingCenter) {
        const newCenter = new CenterCapacity({
          center: center,
          capacity: initialCapacity
        });
        await newCenter.save();
      }
    }
    console.log('Center capacities initialized successfully');
  } catch (err) {
    console.error('An error occurred while initializing center capacities:', err);
  } finally {
    // Close the Mongoose connection (optional)
    await mongoose.connection.close();
  }
}

initializeCapacities();

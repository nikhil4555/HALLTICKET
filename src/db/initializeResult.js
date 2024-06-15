const mongoose = require('mongoose');
const Result = require('./../models/results'); // Import the Result model

// Connect to MongoDB using async/await
async function connectToMongo() {
  try {
    const connectionString = 'mongodb://127.0.0.1:27017/Login'; // Replace with your Render connection string
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for Results');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err; // Re-throw the error to stop execution
  }
}

// Function to generate data for results
function generateData(count) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      hallticket: `202400${i}`,
      email: `test${i}@gmail.com`,
      score: Math.floor(Math.random() * 101) // Random score between 0 and 100
    });
  }
  return data;
}

// Async function to insert data if needed
async function insertDataIfNeeded(data) {
  await connectToMongo(); // Ensure connection before proceeding

  try {
    const existingResultsCount = await Result.countDocuments({});
    if (existingResultsCount === 0) {
      await Result.insertMany(data);
      console.log('Results data inserted successfully');
    } else {
      console.log('Results data already exists in the collection');
    }
  } catch (err) {
    console.error('Failed to interact with database:', err);
  } finally {
    // Close the Mongoose connection (optional)
    await mongoose.connection.close();
  }
}

// Generate sample Result data
const resultData = generateData(50);

// Insert sample data only if collection is empty
insertDataIfNeeded(resultData);

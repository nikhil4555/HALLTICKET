// const mongoose = require('mongoose')
const Result = require('./../models/results')

// Function to generate  data for the results
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
  
  async function insertDataIfNeeded(data) {
    try {
      // Check if any results exist in the collection
      const existingResultsCount = await Result.countDocuments({});
  
      if (existingResultsCount === 0) {
        // Insert data only if collection is empty
        await Result.insertMany(data);
        console.log('Results data inserted successfully for the results part');
      } else {
        console.log('Results data already exists in the results collection');
      }
    } catch (err) {
      console.error('Failed to interact with database:', err);
    }
  }
  
  // Generate sample Result data
  const ResultData = generateData(50);
  
  // Insert sample data only if collection is empty
  insertDataIfNeeded(ResultData);
  
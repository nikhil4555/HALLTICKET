const mongoose = require('mongoose');
const CenterCapacity = require('../models/CenterCapacity'); // Import the CenterCapacity model

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/halltickets', { useNewUrlParser: true, useUnifiedTopology: true }).
// then(() => {
//     console.log('MongoDB connected For Capacites initially');
//     initializeCapacities(); // Call the initialization function here
//   })
//   .catch(err => console.error(err));

// Initialize center capacities
const centers = ["Hyderabad", "Secundrabad", "Uppal", "Gachibowli", "Warangal"];
const initialCapacity = 15;

async function initializeCapacities() {
    try {
        for (const center of centers) {
            const existingCenter = await CenterCapacity.findOne({ center: center });
            // If the center does not exist, create a new entry
            if (!existingCenter) {
                const newCenter = new CenterCapacity({
                    center: center,
                    capacity: initialCapacity
                });
                await newCenter.save();
            }
            console.log('Center capacities initialized successfully');
        }  
    }catch (err) {
        console.error('An error occurred while initializing center capacities:', err);
    }
}
initializeCapacities();


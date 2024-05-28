const Preference = require('../src/models/CenterCapacity');
const HallTicket = require('./../src/models/hallticket');

exports.generateTicket = async (req, res) => {
    const { name, fatherName, mobile, email, preferences } = req.body;
    if (!preferences || !preferences.length) {
        return res.status(400).send('Missing or empty preferences in request body.');
      }
    // // Attempt to assign a hall based on preferences
    // for (let pref of preferences) {
    //     let preference = await Preference.findOne({ city: pref });
    //     if (preference && preference.booked < preference.capacity) {
    //         preference.booked++;
    //         await preference.save();
            
    //         let newTicket = new HallTicket({ name, fatherName, mobile, email, preferences });
    //         await newTicket.save();
            
    //         res.send('Ticket Generated Successfully with preference: ' + pref);
    //         return;
    //     }
    // }

    // res.status(400).send('Unable to generate ticket, all preferences full.');
    for (let pref of preferences) {
        try {
          const preference = await Preference.findOneAndUpdate(
            { city: pref },
            { $inc: { booked: 1 } },
            { new: true, runValidators: true } // To ensure validation on update
          );
    
          if (preference && preference.booked < preference.capacity) {
            let newTicket = new HallTicket({ name, fatherName, mobile, email, preferences });
            await newTicket.save();
            res.send('Ticket Generated Successfully with preference: ' + pref);
            return;
          }
        } catch (error) {
          console.error(error);
          // Handle potential errors during updates or saving tickets
          return res.status(500).send('Internal Server Error');
        }
      }
    
      res.status(400).send('Unable to generate ticket, all preferences full.');
    
};

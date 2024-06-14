const express = require('express');
const bcrypt = require('bcryptjs'); //dependencies to make a hash passcode
const PDFDocument = require('pdfkit'); //dependencies used to create pdf
const userschema = require('./../src/models/register')
const HallTicket = require('./../src/models/hallticket');
const CenterCapacity = require('./../src/models/CenterCapacity');
const Result = require('./../src/models/results')
const initialCapacity = require('../src/db/initializeCapacities');
initialCapacity;
const initializeResult = require('./../src/db/initializeResult')
initializeResult;
const { log } = require('console');
const router = express.Router();



router.get('/', (req, res) => {
    res.render("index");
  });


router.get('/about', (req, res) => {
    res.render("about");
  });

router.get('/contact',(req,res)=>{
    res.render('contact');
})

router.get('/register', (req, res) => {
    res.render('register');
});


// REGISTERATION
router.post('/register', async (req, res) => {
    try {
          
      const email = req.body.email;
      const password = req.body.password;
      const confirmpassword = req.body.cnfpassword;
      const phone = req.body.phone;
  
      //Error handeling
      // Check for duplicate phone number
      const phoneExists = await userschema.findOne({ phone: phone });
      if (phoneExists) {
        return res.redirect('/register?error=phone');
      }
      // Check for duplicate email
      const emailExists = await userschema.findOne({ email: email });
      if (emailExists) {
        return res.redirect('/register?error=email');
      }
  
      // Phone number validation regex
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.redirect('/register?error=phonecheck');
      }
  
      // Password validation regex
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_\-+])[A-Za-z\d@#$%^&*()_\-+]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.redirect('/register?error=password');
      }
      

      if(password === confirmpassword){
        const registerEmployee = new userschema({
          
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
          confirmpassword: req.body.cnfpassword
        })
        
        const registered = await registerEmployee.save();
        res.status(201).render('register', { registrationMessage: 'Registered Successfully!' });
      } else {
        res.send("Passwords are not matching")
      }
    } catch(error) {
      res.status(400).send(error);
    }
});

//LOGIN 
router.post('/login',async (req,res)=>{
    try{
      const email = req.body.email;
      const password = req.body.password;
  
      const useremail = await userschema.findOne({email:email})
  
      const isMatch = await bcrypt.compare(password,useremail.password);
  
      if(isMatch){
        res.status(201).render('main');
      }else{
        res.send("Invalid Login Details");
      }
    }catch(error){
      res.status(400).send("Invalid Login Details");
    }
  })
  
  router.get('/login', (req, res) => {
    res.render('login');
  });


//HALL TICKET
function generateHallTicketNumber() {
  // Generate a random 4-digit number (excluding 0000)
  const randomPart = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  return `202400${randomPart}`;
}

async function generateHallTicketPDF (userData, res) {
    const hallTicketNumber = generateHallTicketNumber(); // Generate the number
  
    const preferences = userData.preference1 ? [userData.preference1, userData.preference2, userData.preference3] : [];
    

    //In here the capacities array will hold the center and capcity values of the latest one from which the db has its values
    const centerCapacities = await CenterCapacity.find();
    let capacities = {};
    centerCapacities.forEach(center => {
        capacities[center.center] = center.capacity;
    });
    let assignedCenter = null;
    

    // Assign center based on preferences
    for (const preference of preferences) {
        if (capacities[preference] > 0) {
            assignedCenter = preference;
            capacities[preference]--;
            // Update the capacity in the database
            await CenterCapacity.updateOne({ center: preference }, { $inc: { capacity: -1 } });
            break;
        }
    }
     // If all center prefernces completed their capacity, assign the last preference as the default
     if (!assignedCenter) {
      assignedCenter = preferences[preferences.length - 1];
    }

    const doc = new PDFDocument();
  
    // Add user information
    doc.text(`Hall Ticket No: ${hallTicketNumber}`, { align: 'center', fontSize: 24 });
    doc.text(`Name: ${userData.name}`, { fontSize: 14 });
    doc.text(`Father's Name: ${userData.fatherName}`, { fontSize: 14 });
    doc.text(`Mobile: ${userData.mobile}`, { fontSize: 14 });
    doc.text(`Email: ${userData.email}`, { fontSize: 14 });
    // Add assigned center
    doc.font('Helvetica-Bold').text(`Assigned Center: ${assignedCenter}`, { fontSize: 14 });
    // Add preference information
    if (preferences.length > 0) {
        doc.text('Preferences Choosen:', { fontSize: 14, bold: true });
        for (let i = 0; i < preferences.length; i++) {
            doc.text(`${i + 1}. ${preferences[i]}`, { fontSize: 12 });
        }
    } else {
        console.error('User preferences not found');
    }
    doc.pipe(res); // Stream the PDF content to the response
    doc.end();
    
    // Save user data to MongoDB
    const newTicket = new HallTicket({
        hallTicketNumber: hallTicketNumber,
        name: userData.name,
        fatherName: userData.fatherName,
        mobile: userData.mobile,
        email: userData.email,
        preferences: preferences,
        assignedCenter: assignedCenter,
        issueDate: Date.now(),
    });
    await newTicket.save(); // Save new HallTicket document
    console.log('User data saved to MongoDB');
    
    
    // Return a promise that resolves after saving
    // return new Promise((resolve, reject) => {
    // res.on('finish', () => resolve());
    // res.on('error', reject);
  // });
    
}

router.post('/generateTicket', async(req,res)=>{
  try {  
  const userData = req.body;
  
   // Phone number validation regex
   const phoneRegex = /^\d{10}$/;
   if (!phoneRegex.test(userData.mobile)) {
       return res.status(400).send({ message: 'Invalid phone number. It must be exactly 10 digits.' });
  }

  //Using find one with the register model and the one we want to check i.e. the entered one
  const registeredUser = await userschema.findOne(
    {
      email: userData.email,
      phone: userData.mobile 
    });
    if (!registeredUser) {
      return res.status(404).send({ message: 'No user found with the provided email or phone.' });
    }

    

    //only once you should generate the hallticket
    const existingHallTicket = await HallTicket.findOne({ email: userData.email });
    if (existingHallTicket) {
      return res.status(400).send({ message: 'HallTicket already generated for this email. You can only generate it once.' });
    }

  
  // V.V..IMP for duplicates-----> As we are refining the search with the register model no need to check here again
  // const existingmobile = await HallTicket.findOne({ mobile: userData.mobile });
  // if (existingmobile) {
  //   return res.status(400).send({ message: 'Duplicate Phone found!! Use New Phone, this exists' });
  // }

  // const existingmail = await HallTicket.findOne({ email:userData.email });
  // if (existingmail) {
  //   return res.status(400).send({ message: 'Duplicate email found. Ticket already generated for this email. Use new!!' });
  // }

await generateHallTicketPDF(userData, res); // Generate PDF
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF'); // Handle errors
  }
  
});


//RESULT
router.get('/result',(req,res)=>{
  res.render('result')
})
router.post('/result',async(req,res)=>{
    const userData = req.body;
    console.log(userData);
    try {
      
      const result = await Result.findOne({
        email:userData.email,
        hallticket:userData.hallticket
      });
      console.log(result);
      if(result){
        console.log('User data matches:', result);
        res.render('viewResult',{result})
      }
      else{
        res.status(404).send('Check the details!! ')
      }
    } catch (error) {
      console.log(error);
    }
})

//LOGOUT
router.get('/logout',(req,res)=>{
  res.render('register');
})

module.exports = router; 
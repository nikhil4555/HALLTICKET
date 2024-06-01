const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const hbs =require('hbs');
const app = express();
const port = process.env.PORT || 4000;

const connectDb = require('./db/conn');
connectDb();

// Password validation with express-validator
// const { check, validationResult } = require('express-validator');

//paths
const static_path = path.join(__dirname, '../../27-Journey/public');
const view_path = path.join(__dirname, '../../27-Journey/templates/views');
const partials_path = path.join(__dirname, '../../27-Journey/templates/partials');
const routes = require('../routes/main')

//middlewares type-->
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','hbs');

//for views and static one
app.set('views',view_path);
app.use(express.static(static_path));
hbs.registerPartials(partials_path);


//CONNECTING WITH ROUTES
app.use(routes)



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


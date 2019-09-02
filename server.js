'use strict';
var express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js')
var cors = require('cors');
var app = express();

// Basic Configuration 
const port = 3000;
const url = process.env.MONGO_URI

/** this project needs a db !! **/ 
mongoose.connect(url,{ useNewUrlParser: true }).then(() => {
    app.listen(port);
    console.log('database connected!')
})
.catch(err => console.log(err));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded());
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/', routes);


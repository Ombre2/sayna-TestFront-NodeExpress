const express = require('express')
const app = express()
var path = require('path');
var cookieParser = require('cookie-parser');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());


require('./routes/index.route')(app);

module.exports = app;
   
const express = require('express')
const app = express()
var path = require('path');
var cookieParser = require('cookie-parser');


app.use(express.static('view'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use((req, res, next) => {
   res.render('pageNotFound.html');
})


require('./routes/index.route')(app);

module.exports = app;
   
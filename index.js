const express = require('express')
const app = express()
var path = require('path');
var cookieParser = require('cookie-parser');


app.set('views', './view')
app.set('view engine', 'pug')


// app.use(express.static('view'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use((req, res, next) => {
   res.render('404', { title: '404', message: '404 not found' });
})


require('./routes/index.route')(app);

module.exports = app;
   
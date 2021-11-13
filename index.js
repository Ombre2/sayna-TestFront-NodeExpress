const express = require('express')
const app = express()
var path = require('path')
var cookieParser = require('cookie-parser')
var session = require('express-session')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000 }
}))


app.set('views', './view')
app.set('view engine', 'pug')


// app.use(express.static('view'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

require('./routes/index.route')(app);

app.use((req, res, next) => {
   res.render('404', { title: '404', message: '404 not found' });
})

app.use(function (req, res, next) {
    if (req.session.views) {
        req.session.views++
    } else {
        req.session.views = 1
    }
})

module.exports = app;
   
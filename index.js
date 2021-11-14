const express = require('express')
const app = express()
var path = require('path')



//Use engine Pug
app.set('views', './view')
app.set('view engine', 'pug')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./routes/index.route')(app);

//SI le route n'existe pas . Afficher page 404.pug
app.use((req, res, next) => {
   res.render('404', { title: '404', message: '404 not found' });
})


module.exports = app;
   
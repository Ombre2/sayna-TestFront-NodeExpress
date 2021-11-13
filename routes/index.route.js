var auth = require("./auth");


module.exports = app => {

  app.get('/', function(req,res){
    res.render('index', { title: 'index.html', message: 'index.html', time: 'you viewed this page ' + req.session.views[''] + ' times' });
  });

  //all route declared here
  app.use('/api', auth);

  //si le route n'existe plus
  // app.use(function(req, res, next) {
  //   if (!req.route) {res.render("pageNotFound.html");}
  //   next();
  // });

};
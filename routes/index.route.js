var auth = require("./auth");


module.exports = app => {

  app.get('/', function(req,res){
    res.render('index.html');
  });

  //all route declared here
  app.use('/api', auth);

  //si le route n'existe plus
  // app.use(function(req, res, next) {
  //   if (!req.route) {res.render("pageNotFound.html");}
  //   next();
  // });
  app.get('*', function (req, res) {
    res.render('pageNotFound.html');
  })

};
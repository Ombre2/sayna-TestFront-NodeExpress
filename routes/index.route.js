var auth = require("./auth");


module.exports = app => {

  // app.get('/', function(req,res){
  //   res.render('view/index.html');
  // });

  //all route declared here
  app.use('/api',  auth);

  //si le route n'existe plus
  // app.use(function(req, res, next) {
  //   if (!req.route) {res.render("view/pageNotFound.html");}
  //   next();
  // });
};
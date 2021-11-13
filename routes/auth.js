var express = require('express');
var router = express.Router();
var db = require('../services/db');
var auth = require("../controllers/auth.js");
const checkTokenMiddleware = require("../controllers/security_token.js")



//route de l'authentification de l'utlisateur
router.post('/login',auth.login);

//route d'inscription de l'utilisateur
router.post('/register', auth.register);

//route de récuperation de l'utilisateur
router.get('/user/:token', checkTokenMiddleware.checkTokenMiddleware, auth.getOneUser);

//route de modification de l'utilisateur
router.put('/user/:token',checkTokenMiddleware.checkTokenMiddleware, auth.updateUser);

//route de modification de password de l'utilisateur
router.put('/user/modifPassword/:token',checkTokenMiddleware.checkTokenMiddleware, auth.updatePassword);

//route de recuperation des utilisateurs
router.get('/users/:token',checkTokenMiddleware.checkTokenMiddleware, auth.getAllUsers);

//route de deconnexion de l'utilisateur
router.delete('/users/:token',checkTokenMiddleware.checkTokenMiddleware, function(req, res) {
  res.send('Example route register');
});

module.exports = router;
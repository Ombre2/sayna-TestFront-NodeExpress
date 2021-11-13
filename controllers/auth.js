var db = require('../services/db');
//Pour la securiter
const jwt = require('jsonwebtoken')
const SECRET_ACCESS_TOKEN = 'testSayna'
const SECRET_REFRESH_TOKEN = 'testSaynaRefresh'

const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.login = async (req, res) => {
	let datas = req.body;
	// Validate request
	if (!req.body.Email && !req.body.Password) {
		res.status(401).send({
			error: true,
			message: "L'Email/Password est manquant"
		});
		return;
	}

	try{
			let data = [];
			let idUser = "";
			await db.collection("users")
				.where('Email', '==', datas.Email) 
				.get().then((querySnapshot) => {
				     querySnapshot.forEach((doc) => {
				     	data.push(doc.data());
				     	isUser = doc.id;
					})
				});
			if(data.length==1){    
				bcrypt.compare(datas.Password, data[0].Password, async (err, result)=> {
					if(result){
						const token_access = jwt.sign({
			              id: isUser,
			              email: data.Email,
			            }, SECRET_ACCESS_TOKEN)

 
						const token_refresh = jwt.sign({
			              id: isUser,
			              email: data.Email,
			            }, SECRET_REFRESH_TOKEN)

						res.status(200).send({
							error: false,
							message: "L\'utilisateur a été authentifié avec succèes",
							token:{
								'token': token_access,
								'refresh-token': token_refresh,
								'createdAt': new Date()
							}
						});
					}else{
						res.status(401).send({
							error: true,
							message: "Votre Email/Password est erroné"
						});
					}
				});
			}else{
				res.status(401).send({
					error: true,
					message: "Votre Email/Password est erroné"
				});
				// res.status(409).send({
				// 	error: true,
				// 	message: "Trop de tentative sur l'email "+data.Email
				// });
			}
		
	}catch(e){
		console.log(e);
	}
}

exports.register = async (req, res) => {
	let datas = req.body;
	// Validate request
	if (!req.body.firstname || !req.body.lastname || !req.body.Email || !req.body.Password || !req.body.date_naissance || !req.body.sexe) {
		res.status(401).send({
			error: true,
			message: "L'une ou plusieurs des données obligatoire sont manquantes"
		});
		return;
	}
	var regexEmail = /\S+@\S+\.\S+/;

	if(!regexEmail.test(req.body.Email)){
		res.status(401).send({
			error: true,
			message: "L'un des données obligatoire ne sont pas conformes"
		});
		return;
	}

	//Tester si le Email existe déjà dans la base de donner
	let data = [];
	await db.collection("users")
		.where('Email', '==', datas.Email)
		.get().then((querySnapshot) => {
		     querySnapshot.forEach((doc) => {
		     	data.push(doc.data());
		    	// console.log(doc.id, ' => ', doc.data());
			})
		});
	if(data.length>=1){
		res.status(401).send({
			error: true,
			message: "Votre email n'ai pas correct"
		});
		return;
	}

	bcrypt.genSalt(saltRounds, function (err, salt) {
		bcrypt.hash(req.body.Password, salt,async function (err, hash) {
			let register = {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				Email: req.body.Email,
				Password: hash,
				date_naissance: req.body.date_naissance,
				sexe: req.body.sexe,
			}
		try{
			// Add a new document with a generated id.
			const result = await db.collection('users').add(register);

			const token_access = jwt.sign({
              id: result.id,
              email: req.body.Email,
            }, SECRET_ACCESS_TOKEN)


			const token_refresh = jwt.sign({
              id: result.id,
              email: req.body.Email,
            }, SECRET_REFRESH_TOKEN)

			//creer colllection pour le token avec IdUser et token
			const addToken = await db.collection('users').add({userId: result.id,token: token_access });

			res.status(200).send({
				error: false,
				message: "L\'utilisateur a été authentifié avec succèes",
				token:{
					'token': token_access,
					'refresh-token': token_refresh,
					'createdAt': new Date()
				}
			});
		}catch(e){
			console.log(e);
		}
		});
	});
}
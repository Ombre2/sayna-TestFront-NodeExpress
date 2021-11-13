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
	if (!req.body.Email || !req.body.Password) {
		res.status(401).send({
			error: true,
			message: "L'Email/Password est manquant"
		});
		return;
	}
	try {
		let data = [];
		let idUser = "";
		await db.collection("users")
			.where('Email', '==', datas.Email)
			.get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					data.push(doc.data());
					idUser = doc.id;
				})
			});
		if (data.length == 1) {
			bcrypt.compare(datas.Password, data[0].Password, async (err, result) => {
				if (result) {
					const token_access = jwt.sign({
						id: idUser,
						email: data.Email,
					}, SECRET_ACCESS_TOKEN,{
				        expiresIn: "2h",
				    })

					const token_refresh = jwt.sign({
						id: idUser,
						email: data.Email,
					}, SECRET_REFRESH_TOKEN,{
				        expiresIn: "2h",
				    })

					let tokens = [];
					//Tester si l'utilisateur a déjà un token dans le BD
					await db.collection('tokens').where('userId', '==', idUser)
						.get()
						.then((querySnapshot) => {
							querySnapshot.forEach((doc) => {
								tokens.push({ id: doc.id, data: doc.data() });
							})
						})


					if (tokens.length >= 1) {
						//Update token
						await db.collection('tokens').doc(tokens[0].id).update({ token: token_access });
					} else {
						//creer colllection pour le token avec IdUser et token
						await db.collection('tokens').add({ userId: idUser, token: token_access });
					}
					res.status(200).send({
						error: false,
						message: "L\'utilisateur a été authentifié avec succèes",
						token: {
							'token': token_access,
							'refresh-token': token_refresh,
							'createdAt': new Date()
						}
					});
				} else {
					res.status(401).send({
						error: true,
						message: "Votre Email/Password est erroné"
					});
				}
			});
		} else {
			res.status(401).send({
				error: true,
				message: "Votre Email/Password est erroné"
			});
			// res.status(409).send({
			// 	error: true,
			// 	message: "Trop de tentative sur l'email "+data.Email
			// });
		}

	} catch (e) {
		res.status(500).send({
			error: true,
			message: "Internal server error" + JSON.stringify(e)
		});
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

	if (!regexEmail.test(req.body.Email)) {
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
			})
		});
	if (data.length >= 1) {
		res.status(401).send({
			error: true,
			message: "Votre email n'ai pas correct"
		});
		return;
	}

	//criptage de mot de passe avec bcrypt
	bcrypt.genSalt(saltRounds, function (err, salt) {
		bcrypt.hash(req.body.Password, salt, async function (err, hash) {
			let register = {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				Email: req.body.Email,
				Password: hash,
				date_naissance: req.body.date_naissance,
				sexe: req.body.sexe,
			    createdAt : new Date().toISOString()
			}
			try {
				// Add a new document with a generated id.
				const result = await db.collection('users').add(register);

				//creation de access_token
				const token_access = jwt.sign({
					id: result.id,
					email: req.body.Email,
				}, SECRET_ACCESS_TOKEN)

				//creation de refresh_token
				const token_refresh = jwt.sign({
					id: result.id,
					email: req.body.Email,
				}, SECRET_REFRESH_TOKEN)

				//creer colllection pour le token avec IdUser et token
				const addToken = await db.collection('tokens').add({ userId: result.id, token: token_access });

				res.status(200).send({
					error: false,
					message: "L\'utilisateur a été authentifié avec succès",
					token: {
						'token': token_access,
						'refresh-token': token_refresh,
						'createdAt': new Date()
					}
				});
			} catch (e) {
				res.status(500).send({
					error: true,
					message: "Internal server error"
				});
			}
		});
	});
}

exports.getOneUser = async (req, res) => {
	let token = req.params.token;
	let userId = "";

	try {
		await db.collection("tokens")
			.where('token', '==', token)
			.get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					userId = doc.data().userId;
				})
			});

		//Get user with document userId in the table users
		let doc = await db.collection("users").doc(userId).get();
		if (!doc.exists) {
			console.log('No such document!');
		} else {
			res.status(200).send({
				error: false,
				user: {
					firstname: doc.data().firstname,
					lastname: doc.data().lastname,
					email: doc.data().Email,
					date_naissance: doc.data().date_naissance,
					sexe: doc.data().sexe,
				}
			});
		}

	} catch (e) {
		res.status(500).send({
			error: true,
			message: "Internal server error"
		});
	}
}



exports.updateUser = async (req, res) => {
	let body = req.body;
	let token = req.params.token;
	let userId = "";

	if (!body.firstname && !body.lastname && !body.date_naissance && !body.sexe) {
		res.status(401).send({
			error: true,
			message: "Aucun données n'a été envoyés"
		});
		return;
	}

	try {
		await db.collection("tokens")
			.where('token', '==', token)
			.get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					userId = doc.data().userId;
				})
			});

		let updateUser = await db.collection("users").doc(userId).update(body);

		if (updateUser) {
			res.status(200).send({
				error: false,
				message: "L'utilisateur a été modifié"
			});
		}
	} catch (e) {
		res.status(500).send({
			error: true,
			message: "Internal server error"
		});
	}

}

exports.updatePassword = async (req, res) => {
	let body = req.body;
	let token = req.params.token;
	let userId = "";

	if (!body.Password) {
		res.status(401).send({
			error: true,
			message: "Aucun données n'a été envoyés"
		});
		return;
	}

	bcrypt.genSalt(saltRounds, function (err, salt) {
		bcrypt.hash(body.Password, salt, async function (err, hash) {
			try {
				await db.collection("tokens")
					.where('token', '==', token)
					.get().then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							userId = doc.data().userId;
						})
					});

				let updateUser = await db.collection("users").doc(userId).update({ Password: hash });

				if (updateUser) {
					res.status(200).send({
						error: false,
						message: "Le mot de passe de l'utilisateur a été modifié"
					});
				}
			} catch (e) {
				res.status(500).send({
					error: true,
					message: "Internal server error"
				});
			}

		});
	});
}


exports.getAllUsers = async (req, res) => {
	try {
		let data = [];
		await db.collection("users")
			.get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					data.push({
						firstname: doc.data().firstname,
						lastname: doc.data().lastname,
						email: doc.data().Email,
						sexe: doc.data().sexe,
					});
				})
			});
		res.status(200).send({
			error: false,
			users: data
		});
	} catch (e) {
		res.status(500).send({
			error: true,
			message: "Internal server error"
		});
	}
}

exports.deleteToken = async (req, res) => {
	try {
		let id = "";
		await db.collection('tokens').where('token', '==', req.params.token)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					id = doc.id;
				})
			})
		await db.collection('tokens').doc(id).delete();
		res.status(200).send({
			error: false,
			message: "L'utilisateur a bien été déconnecté avec succès"
		});
	} catch (e) {
		res.status(500).send({
			error: true,
			message: "Internal server error"
		});
	}
}
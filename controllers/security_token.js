'use strict';
const jwt = require('jsonwebtoken')

const SECRET_ACCESS_TOKEN = 'testSayna'

/* Vérification du token */
exports.checkTokenMiddleware = (req, res, next) => {
	// Récupération du token

	let token = true;
	if (!req.params.token) {
		token = false;
	}

	// Présence d'un token
	if (!token) {
		return res.status(401).json({
			error: true,
			message: 'Le token envoyer n\'est pas conforme'
		})
	}

	// Véracité du token
	jwt.verify(req.params.token, SECRET_ACCESS_TOKEN, (err, decodedToken) => {
		if (err) {
			res.status(401).json({
				error: true,
				message: 'Le token envoyer n\'existe pas'
			})
		} else {
			return next()
		}
	})
}
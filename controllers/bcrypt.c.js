'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.cryptageMdp = (password) => {
	bcrypt.genSalt(saltRounds, function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			// Store hash in your password DB.
			return hash;
		});
	});
}

exports.decryptageMdp = (password, hash) => {
	bcrypt.compare(password, hash, function (err, result) {
		// result == true
		return result;
	});
}
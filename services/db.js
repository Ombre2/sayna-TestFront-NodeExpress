var admin = require("firebase-admin");

var serviceAccount = require("../sayna-testbackend-nodeexpress-firebase-adminsdk-9nkrw-61bb17790b.json");
// var serviceAccount = require("../sayna-testbackend-nodeexpress-firebase-adminsdk-9nkrw-893c86b782.json");


module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
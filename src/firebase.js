const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');

const firestore = new Firestore({
  projectId: 'midyear-data-425905-r3',
  databaseId : "maigendb", 
  keyFilename: serviceAccountPath,
});

module.exports = firestore;
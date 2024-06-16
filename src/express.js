const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
// Middleware untuk memparsing JSON
app.use(bodyParser.json());
// Middleware untuk memparsing x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

module.exports = app;

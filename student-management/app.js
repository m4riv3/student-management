const express = require('express');
const app = express();
const config = require('./config/config');
const mongoose = require('mongoose');
const router = require('./routes/user');
const cors = require('cors');


mongoose.connect(config.uri, { useNewUrlParser: true,useCreateIndex:true });
app.use(cors());
app.options('*', cors());
app.use('/', router);

module.exports = app;
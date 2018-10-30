const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/class';
mongoose.connect(url, { useNewUrlParser: true });
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

exports.isAuth = (req, res, next) => {
    let token = req.query.token == null ? req.headers['x-access-token'] : req.query.token;
    if (token) {
        jwt.verify(token, config.jwtSecret, (err, payload) => {
            if (err) res.status(404).json({ message: 'Authenticate Error' });
            else {
                console.log(`decode ${payload.username}`);
                User.findOnlyOne({ 'username': payload.username })
                    .then(user => {
                        req.body.username = user.username;
                        next();
                    })
                    .catch(err => {
                        console.log(err);
                })
            }
        })
    }
    else {
        res.json({ message: 'Token error' });
    }
}
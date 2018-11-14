const User = require('../models/user');
const config = require('../config/config');
const Contact = require('../models/contact');
const jwt = require('jsonwebtoken');
const blacklist = require('express-jwt-blacklist');
const passport = require('passport');
const redis = require('redis');


const client = redis.createClient(6379, config.host);
client.on('connect', () => {
    console.log('redis client connected');
})
client.on('error', (err) => {
    console.error('Error: No connection');
})

function checkValidToken(user) {
    return new Promise((resolve, reject) => {
        client.get(`token${user}`, (error, result) => {
            error == null ? resolve(result) : reject(error);
        })
    })
}

exports.register = (req, res) => {
    console.log(`${req.method} ${req.baseUrl}`);
    let rights = ['notification', 'user-profile', 'time-table', 'dashboard', 'student-list'];
    req.body.roles.indexOf('admin') === 0 ? (rights = ['notification', 'user-profile', 'time-table', 'dashboard', 'student-list']) : (rights = ['notification', 'user-profile', 'time-table'])
    const data = {
        username: req.body.username,
        class: req.body.class,
        name: req.body.name,
        password: req.body.password,
        roles: req.body.roles,
        rights: rights
    };
    User.createUser(data)
        .then(newUser => {
            const contact = {
                student: newUser._id,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
            }
            Contact.create(contact)
                .then(contactUser => {
                    return res.send({ roles: newUser.roles, rights: newUser.rights });
                })
        })
}

exports.login = (req, res) => {
    console.log(`User ${req.body.username} login`);
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByStdID(username)
        .then(user => {
            if (user) {
                User.comparePassword(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                username: user.username,
                                roles: user.roles
                            };
                            let token = jwt.sign(payload, config.jwtSecret, { expiresIn: 60 * 5 });
                            let jsRes = { user: user.username, access_token: token };
                            res.json(jsRes);
                        }
                        else {
                            res.json({ 'message': 'Invalid Password' });
                        }
                    })
                    .catch(err => {
                        res.send(json(err))
                    })
            }
            else {
                res.json({ 'message': 'Invalid User' });
            }
        })
}

exports.logout = (req, res) => {
    const user = req.body.username;
    const token = req.body.token;
    client.setex(`token${user}`, 300, token , (err, result) => {
        if (err) res.json(err);
        else res.status(200).json({ 'message': `Token of user ${user} is added in blacklist` });
    });
}
exports.users = (req, res) => {
    const token = req.body.token || req.headers['x-access-token'];
    const user = req.body.username;
    checkValidToken(user)
        .then(result => {
            if (result === token) {
                return res.json({ 'message': 'You dont have permission, invalid token' });
            }
            else {
                User.listUser({}, (err, result) => {
                    if (err) res.send(JSON.stringify(err));
                    else {
                        return res.send(JSON.stringify(result));
                    }
                })
            }
    })
}
exports.user = (req, res) => {
    const token = req.body.token || req.headers['x-access-token'];
    const user = req.body.username;
    checkValidToken(user)
        .then(result => {
            if (result === token) {
                return res.json({ 'message': 'You dont have permission, invalid token' });
            }
            else {
                User.findOnlyOne({ username: req.body.username })
                    .then(user => {
                        res.send(user);
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => {
            res.json(err);
    })
}


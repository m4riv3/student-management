const User = require('../models/user');
const config = require('../config');
const Contact = require('../models/contact');
const jwt = require('jsonwebtoken');


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
    console.log('headers:' + req.headers.authorization);
    console.log(`User ${req.body.username} login`);
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByStdID(username)
        .then(user => {
            User.comparePassword(password, user.password)
                .then(isMatch => {
                    const payload = { username: user.username };
                    let token = jwt.sign(payload, config.jwtSecret, { expiresIn: 60*10 });
                    console.log(`token : ${token}`);
                    let jsRes = { access_token: token};
                    res.json(jsRes);
                })
                .catch(err => {
                    res.send(json(err))
                })
        })
}
exports.listall = (req, res) => {
    User.listUser({}, (err, result) => {
        if (err) res.send(JSON.stringify(err));
        else {
            return res.send(JSON.stringify(result));
        }
    })
}
exports.users = (req, res) => {
    User.findOnlyOne({ username: req.body.username })
        .then(user => {
            res.send(user);
        })
        .catch(err => console.log(err));

}
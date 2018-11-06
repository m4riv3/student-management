const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authController.isAuth, userController.users);
module.exports = router;
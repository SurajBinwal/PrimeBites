const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { storeReturnTo } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/register')
    .get(authController.renderRegister)
    .post(upload.single('image'), authController.register);

router.route('/login')
    .get(authController.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), authController.login);

router.get('/logout', authController.logout);

module.exports = router;

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { isLoggedIn, isRestaurant, validateMenuItem, isMenuAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .post(isLoggedIn, isRestaurant, upload.single('image'), validateMenuItem, menuController.createItem);

router.get('/new', isLoggedIn, isRestaurant, menuController.renderNewForm);

router.delete('/:id', isLoggedIn, isRestaurant, isMenuAuthor, menuController.deleteItem);

module.exports = router;

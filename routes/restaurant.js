const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.index);
router.get('/help', (req, res) => res.render('help'));
router.get('/restaurants/:id', restaurantController.show);

module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isLoggedIn, isRestaurant } = require('../middleware');

router.get('/cart', isLoggedIn, orderController.viewCart);
router.post('/cart/:id', isLoggedIn, orderController.addToCart);
router.post('/cart/:id/update', isLoggedIn, orderController.updateCartItem);
router.post('/checkout', isLoggedIn, orderController.checkoutMock);

router.get('/:id', isLoggedIn, orderController.trackOrder);
router.patch('/:id/status', isLoggedIn, isRestaurant, orderController.updateStatus);

module.exports = router;

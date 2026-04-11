const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

module.exports.viewCart = (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    res.render('orders/cart', { cart, total });
};

module.exports.addToCart = async (req, res) => {
    const { id } = req.params;
    const item = await MenuItem.findById(id).populate('restaurant');
    if (!item) {
        req.flash('error', 'Item not found');
        return res.redirect('back');
    }
    
    if(!req.session.cart) req.session.cart = [];
    const cart = req.session.cart;
    
    const existing = cart.find(c => c.menuItem === id);
    if(existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            menuItem: id,
            name: item.name,
            price: item.price,
            quantity: 1,
            restaurantName: item.restaurant?.restaurantName || 'Unknown Restaurant'
        });
    }
    
    req.flash('success', `Added ${item.name} to cart`);
    res.redirect(`/restaurants/${item.restaurant._id}`);
};

module.exports.updateCartItem = (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    
    if(!req.session.cart) return res.redirect('/orders/cart');
    
    const existing = req.session.cart.find(c => c.menuItem === id);
    if(existing) {
        if(action === 'increment') {
            existing.quantity += 1;
        } else if(action === 'decrement') {
            existing.quantity -= 1;
            if(existing.quantity <= 0) {
                req.session.cart = req.session.cart.filter(c => c.menuItem !== id);
                req.flash('success', `Removed item from cart`);
            }
        }
    }
    res.redirect('/orders/cart');
};

module.exports.checkoutMock = async (req, res) => {
    const cart = req.session.cart;
    if(!cart || cart.length === 0) {
        req.flash('error', 'Your cart is empty');
        return res.redirect('/menu');
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const order = new Order({
        user: req.user._id,
        items: cart,
        totalAmount: total,
        status: 'Processing' // Mock paid
    });
    
    await order.save();
    req.session.cart = []; // clear cart
    req.flash('success', 'Order Placed! Simulating Payment Success.');
    res.redirect(`/orders/${order._id}`);
};

module.exports.trackOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(!order) {
        req.flash('error', 'Cannot find that order!');
        return res.redirect('/menu');
    }
    res.render('orders/tracker', { order });
};

module.exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { status: req.body.status });
    res.redirect(`/orders/${id}`);
};

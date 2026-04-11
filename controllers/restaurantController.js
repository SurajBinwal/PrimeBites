const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

module.exports.index = async (req, res) => {
    const restaurants = await User.find({ role: 'restaurant' });
    res.render('restaurants/index', { restaurants });
};

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const restaurant = await User.findById(id);
    if (!restaurant || restaurant.role !== 'restaurant') {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/');
    }
    const items = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true });
    res.render('restaurants/show', { restaurant, items });
};

const { menuItemSchema } = require('./schemas.js');
const MenuItem = require('./models/MenuItem');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = (req.method === 'GET' ? req.originalUrl : req.get('Referer')) || '/';
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.isRestaurant = (req, res, next) => {
    if (req.user && (req.user.role === 'restaurant' || req.user.role === 'admin')) {
        return next();
    }
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/');
};

module.exports.isMenuAuthor = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item.restaurant.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/restaurants/${item.restaurant}`);
    }
    next();
};

module.exports.validateMenuItem = (req, res, next) => {
    // Modify body to match Joi schema if needed
    const { error } = menuItemSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg);
        return res.redirect('back');
    } else {
        next();
    }
};

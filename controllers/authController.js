const User = require('../models/User');

module.exports.renderRegister = (req, res) => {
    res.render('auth/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, role, restaurantName, description, rating } = req.body;
        const user = new User({ email, username, role });
        
        if (role === 'restaurant') {
            user.restaurantName = restaurantName;
            user.description = description;
            user.rating = rating || 5.0;
            if (req.file) {
                user.image = { url: req.file.path, filename: req.file.filename };
            } else {
                user.image = { url: 'https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&q=80', filename: 'default' };
            }
        }

        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to PrimeBites!');
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('auth/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
};

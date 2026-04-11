if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cookieParser = require('cookie-parser');

const User = require('./models/User');

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurant');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_ordering_mvc')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('Mongo Connection Error:', err));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const sessionConfig = {
    name: 'session',
    secret: process.env.SESSION_SECRET || 'thisShouldBeABetterSecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    if (!req.session.cart) req.session.cart = [];
    res.locals.cartCount = req.session.cart.reduce((acc, item) => acc + item.quantity, 0);
    next();
});

app.use('/', authRoutes);
app.use('/', restaurantRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { error: 'Page Not Found' });
});

app.use((err, req, res, next) => {
    console.error("APP ERROR", err);
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});

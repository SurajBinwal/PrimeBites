const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['customer', 'restaurant'],
        default: 'customer'
    },
    // Restaurant Specific Fields
    restaurantName: String,
    description: String,
    rating: {
        type: Number,
        default: 5.0
    },
    image: {
        url: String,
        filename: String
    }
});

// Adds username, hash, salt, and authentication methods
UserSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

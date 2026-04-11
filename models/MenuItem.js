const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: String,
    category: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);

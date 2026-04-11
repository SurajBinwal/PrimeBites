const Joi = require('joi');

module.exports.menuItemSchema = Joi.object({
    menuItem: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().allow('', null),
        category: Joi.string().required(),
        isAvailable: Joi.boolean()
    }).required()
});

module.exports.userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('customer', 'restaurant').required(),
    restaurantName: Joi.alternatives().conditional('role', { is: 'restaurant', then: Joi.string().required() }),
    description: Joi.alternatives().conditional('role', { is: 'restaurant', then: Joi.string().required() }),
    rating: Joi.alternatives().conditional('role', { is: 'restaurant', then: Joi.number().min(0).max(5) })
});

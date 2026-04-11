const MenuItem = require('../models/MenuItem');
const { cloudinary } = require('../cloudinary');

module.exports.renderNewForm = (req, res) => {
    const restaurantId = req.query.restaurantId;
    res.render('menu/new', { restaurantId });
};

module.exports.createItem = async (req, res) => {
    const item = new MenuItem(req.body.menuItem);
    if (req.user.role === 'admin') {
        item.restaurant = req.body.restaurantId;
        if (!item.restaurant) {
            req.flash('error', 'Restaurant ID missing for admin creation!');
            return res.redirect('back');
        }
    } else {
        item.restaurant = req.user._id;
    }
    if(req.file) {
        item.image = { url: req.file.path, filename: req.file.filename };
    } else {
        item.image = { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', filename: 'default' };
    }
    await item.save();
    req.flash('success', 'Successfully made a new menu item!');
    res.redirect(`/restaurants/${item.restaurant}`);
};

module.exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    const restaurantId = item.restaurant;
    if(item.image && item.image.filename !== 'default') {
        await cloudinary.uploader.destroy(item.image.filename);
    }
    await MenuItem.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted menu item');
    res.redirect(`/restaurants/${restaurantId}`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) {
        req.flash('error', 'Cannot find that menu item!');
        return res.redirect(`/restaurants/${req.user._id}`);
    }
    res.render('menu/edit', { item });
};

module.exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, { ...req.body.menuItem });
    if(req.file) {
        if(item.image && item.image.filename !== 'default') {
            await cloudinary.uploader.destroy(item.image.filename);
        }
        item.image = { url: req.file.path, filename: req.file.filename };
    }
    await item.save();
    req.flash('success', 'Successfully updated menu item!');
    res.redirect(`/restaurants/${item.restaurant}`);
};

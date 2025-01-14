const mongoose = require('mongoose');

const validateRGBColor = function(text) {
    const re = /^rgb\([0-9]+, *[0-9]+, *[0-9]+\)+$/;
    return re.test(text);
};

const TagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
        validate: [validateRGBColor, 'Please fill a valid RGB color'],
    },
    isLightColor: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('Tag', TagSchema);
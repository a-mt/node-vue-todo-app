const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    isLightColor: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('Tag', TagSchema);
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
        index: true,
    },
    position: {
        type: Number,
        default: 0,
    },
    priority: {
        type: Number,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tags: [{
        _id: {
            type: mongoose.ObjectId,
            index: true,
        },
        title: String,
        color: String,
        isLightColor: Boolean,
    }],
});

TodoSchema.index({
    title: 'text'
}, {
    default_language: 'none',
    caseSensitive: false,
});

module.exports = mongoose.model('Todo', TodoSchema)

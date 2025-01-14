const mongoose = require('mongoose');
const Tag = require('./Tag');

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
    // We assume that a tag's infos (title, color) are rarely updated
    // But the list of todos is often consulted: keep the tags as embedded documents
    tags: [{
        type: Tag.schema,
    }],
});

TodoSchema.index({'tags._id': 1});
TodoSchema.index({
    title: 'text'
}, {
    default_language: 'none',
    caseSensitive: false,
});

module.exports = mongoose.model('Todo', TodoSchema)

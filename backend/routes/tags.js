// backend/routes/tags.js

const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const Todo = require('../models/Todo');

// GET all tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find().exec();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one tag
router.get('/:id', getTag, (req, res) => {
    res.json(res.tag);
});

// CREATE a tag
router.post('/', async (req, res) => {
    try {
        const tag = new Tag({
            title: req.body.title,
            color: req.body.color,
        });
        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a tag
router.patch('/:id', getTag, async (req, res) => {
    if (req.body.title != null) {
        res.tag.title = req.body.title;
    }
    if (req.body.color != null) {
        res.tag.color = req.body.color;
    }
    try {
        const updatedTag = await res.tag.save();
        res.json(updatedTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a tag
router.delete('/:id', getTag, async (req, res) => {
    try {
        const deletedTag = await Tag.findById(req.params.id);

        // Mettre à jour les tags des todos existants
        await Todo.updateMany({}, {$pull: {tags: {_id: req.params.id}}});

        await Tag.deleteOne({ _id: req.params.id });

        res.json({ message: 'Deleted Tag' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get tag by ID
async function getTag(req, res, next) {
    let tag;
    try {
        tag = await Tag.findById(req.params.id);
        if (tag == null) {
            return res.status(404).json({ message: 'Cannot find tag' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.tag = tag;
    next();
}

module.exports = router;

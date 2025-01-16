const Tag = require('../models/Tag');
const Todo = require('../models/Todo');
const isLightColor = require('../utils/is-light-color');

// GET all tags
exports.list = async (req, res) => {
    try {
        const tags = await Tag.find().exec();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET one tag
exports.get = (req, res) => {
    res.json(res.tag);
};

// CREATE a tag
exports.create = async (req, res) => {
    try {
        const tag = new Tag({
            title: req.body.title,
            color: req.body.color,
            isLightColor: isLightColor(req.body.color),
        });
        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE a tag
exports.update = async (req, res) => {
    if (req.body.title != null) {
        res.tag.title = req.body.title;
    }
    if (req.body.color != null) {
        res.tag.color = req.body.color;
        res.tag.isLightColor = isLightColor(req.body.color);
    }
    try {
        const updatedTag = await res.tag.save();

        // Mettre à jour les tags des todos existants
        await Todo.updateMany({'tags._id': updatedTag._id}, {$set: {'tags.$': updatedTag}});

        res.json(updatedTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE a tag
exports.delete = async (req, res) => {
    try {
        const deletedTag = await Tag.findById(req.params.id);

        // Mettre à jour les tags des todos existants
        await Todo.updateMany({}, {$pull: {tags: {_id: deletedTag._id}}});
        await Tag.deleteOne({ _id: deletedTag._id });

        res.json({ message: 'Deleted Tag' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
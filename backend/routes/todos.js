// backend/routes/todos.js

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const Tag = require('../models/Tag');

// GET all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort('position').exec();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET todos with a pagination, handling search, filter and sort
router.get('/search', async (req, res) => {
    const PAGE_SIZE = 10;
    const filter = {};

    // Search by title
    const q = req.query.q || '';
    if (q) {
        filter['$text'] = { $search: q };
    }

    // Filter by status
    if (req.query.completed) {
        filter['completed'] = !!parseInt(req.query.completed);
    }

    // Filter by tag
    if (req.query.tag) {
        filter['tags._id'] = req.query.tag;
    }

    // Sort by priority
    const sort = [];
    if (req.query.sort) {
        let paramSort = req.query.sort;
        let asc = true;

        if (paramSort.startsWith('-')) {
            asc = false;
            paramSort = paramSort.substr(1);
        }
        // Only authorize sort on scalar attributes
        if (Todo.schema.tree[paramSort]?.type) {
            sort.push([paramSort, asc ? 1: -1]);
        } else {
            return res.status(400).json({ message: `${paramSort} is not a valid sort` });
        }
        if (paramSort != 'position') {
            sort.push(['position', 1]);
        }

    } else {
        sort.push(['position', 1]);
    }

    try {
        // Handle pagination
        const count = await Todo.find(filter).count();
        const pageCount = count ? Math.ceil(count / PAGE_SIZE) : 0;

        let page = Math.max(parseInt(req.query.page) || 1, 1);
        if (page > pageCount) {
            page = pageCount;
        }
        let offset = PAGE_SIZE*(page-1);
        let todos = [];

        if (count) {
            todos = await (
                Todo
                .find(filter)
                .sort(sort)
                .skip(offset)
                .limit(PAGE_SIZE)
                .exec()
            );
        }
        res.json({
            data: todos,
            meta: {
                pagination: {
                    page,
                    offset,
                    perPage: PAGE_SIZE,
                    totalCount: count,
                    pageCount,
                },
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all todos by tag
router.get('/by-tag/:tagId', async (req, res) => {
    try {
        const todos = await (
            Todo
            .find({'tags._id': req.params.tagId})
            .sort('priority', 'position')
            .exec()
        );
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one todo
router.get('/:id', getTodo, (req, res) => {
    res.json(res.todo);
});

// CREATE a todo
router.post('/', async (req, res) => {
    try {
        const maxPositionTodo = await Todo.findOne().sort('-position').exec();
        const newPosition = maxPositionTodo ? maxPositionTodo.position + 1 : 1;

        const todo = new Todo({
            title: req.body.title,
            priority: req.body.priority || 1,
            position: newPosition,
            tags: [],
        });
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a todo
router.patch('/:id', getTodo, async (req, res) => {
    if (req.body.title != null) {
        res.todo.title = req.body.title;
    }
    if (req.body.completed != null) {
        res.todo.completed = req.body.completed;
    }
    if (req.body.priority != null) {
        res.todo.priority = req.body.priority;
    }
    try {
        const updatedTodo = await res.todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ADD tags to a todo
router.post('/:id/tags', getTodo, async (req, res) => {
    const { tags } = req.body;  // Array of ids

    if (!Array.isArray(tags) || tags.length > 10) {
        return res.status(400).json({ message: 'Invalid data format' });
    }
    try {
        const embeddedTags = await Tag.find({_id: {$in: tags}}, {title: 1, color: 1, isLightColor: 1});
        if (embeddedTags == null) {
            return res.status(404).json({ message: 'Cannot find tag' });
        }
        res.todo.tags.push(...embeddedTags);

        try {
            const updatedTodo = await res.todo.save();
            res.json(updatedTodo);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }

    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
});

// DELETE tags from a todo
router.delete('/:id/tags', getTodo, async (req, res) => {
    const { tags } = req.body;  // Array of ids

    if (!Array.isArray(tags) || tags.length > 10) {
        return res.status(400).json({ message: 'Invalid data format' });
    }
    try {
        res.todo.tags = res.todo.tags.filter(tag => tags.indexOf(""+tag._id) == -1);
        try {
            const updatedTodo = await res.todo.save();
            res.json(updatedTodo);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }

    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
});

// DELETE a todo
router.delete('/:id', getTodo, async (req, res) => {
    try {
        const deletedTodo = await Todo.findById(req.params.id);
        await Todo.deleteOne({ _id: req.params.id });
        
        // Mettre à jour les positions des todos restants
        await Todo.updateMany(
            { position: { $gt: deletedTodo.position } },
            { $inc: { position: -1 } }
        );
        
        res.json({ message: 'Deleted Todo' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// REORDER todos
router.put('/reorder', async (req, res) => {
    const { todos } = req.body; // Array de todos avec les nouvelles positions
    const offset = req.body.positionOffset || 0;

    if (!Array.isArray(todos)) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    try {
        const bulkOps = todos.map((todo, index) => ({
            updateOne: {
                filter: { _id: todo._id },
                update: { position: offset + index + 1 },
            }
        }));

        await Todo.bulkWrite(bulkOps);
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get todo by ID
async function getTodo(req, res, next) {
    let todo;
    try {
        todo = await Todo.findById(req.params.id);
        if (todo == null) {
            return res.status(404).json({ message: 'Cannot find todo' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.todo = todo;
    next();
}

module.exports = router;

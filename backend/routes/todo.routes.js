const router = require('express').Router();
const controller = require('../controllers/todo.controller');
const Todo = require('../models/Todo');

// Middleware to get todo by ID
async function getTodoMiddleware(req, res, next) {
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

router
.get('/', controller.list)
.get('/search', controller.searchList)
.get('/by-tag/:tagId', controller.listByTag)
.get('/:id', getTodoMiddleware, controller.get)
.post('/', controller.create)
.patch('/:id', getTodoMiddleware, controller.update)
.post('/:id/tags', getTodoMiddleware, controller.addTags)
.delete('/:id/tags', getTodoMiddleware, controller.removeTags)
.delete('/:id', getTodoMiddleware, controller.delete)
.put('/reorder', controller.reorderList);

module.exports = router;

const router = require('express').Router();
const controller = require('../controllers/tag.controller');

// Middleware to get tag by ID
async function getTagMiddleware(req, res, next) {
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

router
.get('/', controller.list)
.get('/:id', getTagMiddleware, controller.get)
.post('/', controller.create)
.patch('/:id', getTagMiddleware, controller.update)
.delete('/:id', getTagMiddleware, controller.delete)

module.exports = router;

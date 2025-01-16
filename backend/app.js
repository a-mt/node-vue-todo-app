const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Définit les middlewares
app.use(cors());
app.use(bodyParser.json());

// Définit les routes
const router = express.Router();
router.use('/todos', require('./routes/todo.routes.js'));
router.use('/tags', require('./routes/tag.routes.js'));
app.use('/api', router);

module.exports = app;
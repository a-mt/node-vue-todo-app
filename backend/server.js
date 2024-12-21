const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/todos';

app.use(cors());
app.use(bodyParser.json());

app.use('/api/todos', todoRoutes);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4  // Forcer IPv4
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {  // Écouter sur toutes les interfaces
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Arrêter le processus en cas d'erreur
});
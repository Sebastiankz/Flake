import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import userRoutes from './routes/routes.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);

try {
    db.authenticate();
    console.log('Connection has been established successfully (DB).');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server running on port 3000 in http://localhost:3000/');
});
import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import loginRoutes from './login.js'; // Importa las rutas del login

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Montar rutas
app.use('/users', userRoutes); // Rutas de usuarios (ya existentes)
app.use('/login', loginRoutes); // Rutas de login

// Probar conexión a la base de datos
try {
    db.authenticate();
    console.log('Connection has been established successfully (DB).');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// Ruta básica para verificar el servidor
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Server running on port 3000 in http://localhost:3000/');
});

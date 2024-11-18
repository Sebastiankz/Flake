import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import loginRoutes from './login.js'; // Importa las rutas del login
import profesorRoutes from './routes/ProfesorRoutes.js'; 
import alumnoRoutes from './routes/AlumnoRoutes.js';
import horarioRoutes from './routes/HorarioRoutes.js';
import aulaRoutes from './routes/AulaRoutes.js';
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/profesores', profesorRoutes);  
app.use('/alumnos', alumnoRoutes);
app.use('/horarios', horarioRoutes);
app.use('/aulas', aulaRoutes);

// Montar rutas
//app.use('/users', userRoutes); // Rutas de usuarios (falta ver como configurar esto)
app.use('/login', loginRoutes); // Rutas de login

// Probar conexión a la base de datos
try {
    db.authenticate();
    console.log('Connection has been established successfully (DB).');

    await db.sync();
    console.log('All models were synchronized successfully.');
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

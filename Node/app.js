import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import loginRoutes from './login.js'; // Importa las rutas del login
import profesorRoutes from './routes/ProfesorRoutes.js'; 
import alumnoRoutes from './routes/AlumnoRoutes.js';
import horarioRoutes from './routes/HorarioRoutes.js';
import aulaRoutes from './routes/AulaRoutes.js';
import institucionRoutes from './routes/InstitucionRoutes.js';
import HorarioProfesorRoutes from './routes/HorarioProfesorRoutes.js';
import asignacionRoutes from './routes/AsignacionRoutes.js';
import RegistrarAsistencia from './routes/RegistroAsistenciaRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/profesores', profesorRoutes); // Rutas de profesores  
app.use('/alumnos', alumnoRoutes); // Rutas de alumnos
app.use('/horarios', horarioRoutes); // Rutas de horarios
app.use('/aulas', aulaRoutes); // Rutas de aulas
app.use('/instituciones', institucionRoutes); //Rutas de instituciones
app.use('/login', loginRoutes); // Rutas de login
app.use('/horarioProfesor', HorarioProfesorRoutes); // Rutas de horarios de profesores
app.use('/asignaciones', asignacionRoutes); // Rutas de asignaciones
app.use('/asistencia', RegistrarAsistencia); // Rutas necesarias para el registro de asistencia
try {
    db.authenticate();
    console.log('Connection has been established successfully (DB).');

    await db.sync();
    console.log('All models were synchronized successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(3000, () => {
    console.log('Server running on port 3000 in http://localhost:3000/');
});


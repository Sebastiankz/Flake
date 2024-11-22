import express from 'express';
import cors from 'cors';
import session from 'express-session';
import db from './database/db.js';

import loginRoutes from './login.js'; 
import profesorRoutes from './routes/ProfesorRoutes.js'; 
import alumnoRoutes from './routes/AlumnoRoutes.js';
import horarioRoutes from './routes/HorarioRoutes.js';
import aulaRoutes from './routes/AulaRoutes.js';
import institucionRoutes from './routes/InstitucionRoutes.js';
import HorarioProfesorRoutes from './routes/HorarioProfesorRoutes.js';
import asignacionRoutes from './routes/AsignacionRoutes.js';
import RegistrarAsistencia from './routes/RegistroAsistenciaRoutes.js';
import evaluacionRoutes from './routes/EvaluacionRoutes.js';

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, // Permitir cookies
}));

// Middleware para analizar los cuerpos de las solicitudes como JSON
app.use(express.json());  // Este middleware es necesario para que `req.body` esté disponible

// Conexión a la base de datos
try {
    await db.authenticate();
    console.log('Conexión establecida con la base de datos.');

    await db.sync();
    console.log('Modelos sincronizados con la base de datos.');
} catch (error) {
    console.error('Error al conectar la base de datos:', error);
}

// ----------------------------- RUTAS -----------------------------
console.log('Configurando rutas...');
app.use('/profesores', profesorRoutes);  
app.use('/alumnos', alumnoRoutes); 
app.use('/horarios', horarioRoutes); 
app.use('/aulas', aulaRoutes); 
app.use('/instituciones', institucionRoutes); 
app.use('/login', loginRoutes); 
app.use('/horarioProfesor', HorarioProfesorRoutes); 
app.use('/asignaciones', asignacionRoutes); 
app.use('/asistencia', RegistrarAsistencia);
app.use('/evaluaciones', evaluacionRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('Hello World');
});

// ----------------------------- INICIAR SERVIDOR -----------------------------
const PORT = 5000;
console.log('Intentando iniciar el servidor...');
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} ya está en uso. Cambia el puerto o detén el proceso que lo está ocupando.`);
    } else {
        console.error('Error al iniciar el servidor:', err);
    }
});

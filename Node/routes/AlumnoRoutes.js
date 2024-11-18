import express from 'express';
import { 
    getOneAlumno,
    getAllAlumnos,
    createAlumno,
    updateAlumno,
    deleteAlumno
        } from "../controllers/AlumnoCRUD.js";

const router = express.Router();

router.get('/', getAllAlumnos);       // Obtener todos los alumnos
router.get('/:id_alumno', getOneAlumno); // Obtener un alumno específico por ID
router.post('/', createAlumno);        // Crear un nuevo alumno
router.put('/:id_alumno', updateAlumno);  // Actualizar un alumno específico por ID
router.delete('/:id_alumno', deleteAlumno); // Eliminar un alumno específico por ID

export default router;
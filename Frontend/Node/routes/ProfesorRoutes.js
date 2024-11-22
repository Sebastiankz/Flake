import express from 'express';
import {
    getAllprofesores,
    getOneProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor
} from '../controllers/ProfesorCRUD.js';  // Ajusta el nombre de archivo si es necesario

const router = express.Router();

// Definir las rutas para las operaciones de los profesores
router.get('/', getAllprofesores);       // Obtener todos los profesores
router.get('/:id_profesor', getOneProfesor); // Obtener un profesor específico por ID
router.post('/', createProfesor);        // Crear un nuevo profesor
router.put('/:id_profesor', updateProfesor);  // Actualizar un profesor específico por ID
router.delete('/:id_profesor', deleteProfesor); // Eliminar un profesor específico por ID

export default router;

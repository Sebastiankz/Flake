import express from 'express';
import {
    getEvaluacionesPorHorario,
    crearEvaluaciones,
    actualizarNota,
    eliminarEvaluacion,
} from '../controllers/EvaluacionCRUD.js';

const router = express.Router();

// Rutas del CRUD
router.get('/:id_horario', getEvaluacionesPorHorario); // Obtener evaluaciones por horario
router.post('/', crearEvaluaciones); // Crear evaluaciones
router.put('/:id_evaluacion', actualizarNota); // Actualizar nota
router.delete('/:id_evaluacion', eliminarEvaluacion); // Eliminar evaluación

export default router;

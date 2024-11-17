import express from 'express';
import {
    getOneHorario,
    getAllHorarios,
    createHorario,
    updateHorario,
    deleteHorario
} from "../controllers/HorarioCRUD.js";

const router = express.Router();

router.get('/', getAllHorarios);       // Obtener todos los horarios
router.get('/:id_horario', getOneHorario); // Obtener un horario específico por ID
router.post('/', createHorario);        // Crear un nuevo horario
router.put('/:id_horario', updateHorario);  // Actualizar un horario específico por ID
router.delete('/:id_horario', deleteHorario); // Eliminar un horario específico por ID

export default router;
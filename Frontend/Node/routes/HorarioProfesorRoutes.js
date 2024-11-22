import { getHorariosByProfesor } from "../controllers/HorarioProfesor.js";
import express from 'express';

const router = express.Router();

router.get('/:id_profesor', getHorariosByProfesor);

export default router;
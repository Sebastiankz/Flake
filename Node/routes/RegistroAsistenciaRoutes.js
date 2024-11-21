import { 
    institucionesProfesor,
    obtenerAulasProfesor,
    obtenerHorariosAula,
    obtenerEstudiantesPorHorario } from "../controllers/RegistrarAsistencia.js";

import express from "express";

const router = express.Router();

router.get('/instituciones/:id_profesor', institucionesProfesor);
router.get('/aulas/:id_profesor/:cod_DANE', obtenerAulasProfesor);
router.get('/horarios/:id_aula', obtenerHorariosAula);
router.get('/estudiantes/:id_horario', obtenerEstudiantesPorHorario);

export default router;
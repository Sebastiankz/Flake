import {asignacionHorarioToAula}  from "../controllers/AsignacionCRUD.js";
import express from 'express';

const router = express.Router();

router.post('/', asignacionHorarioToAula);

export default router;
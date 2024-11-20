import { registrarActualizarAsistencia } from "../controllers/RegistrarAsistencia.js";
import express from "express";

const router = express.Router();

router.post('/', registrarActualizarAsistencia);

export default router;
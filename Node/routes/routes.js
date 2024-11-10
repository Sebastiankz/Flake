//archivo que define las rutas de la de la API

import express from 'express';
import { getAllRegisters, getOneRegister, createRegister, updateRegister, deleteRegister } from '../controllers/BlogController.js';

const router = express.Router();

router.get('/', getAllRegisters);
router.get('/:id', getOneRegister);
router.post('/', createRegister);
router.put('/:id', updateRegister);
router.delete('/:id', deleteRegister);

export default router;
import express from 'express';

import {
    getAllInstituciones,
    getOneInstitucion,
    createInstitucion,
    updateInstitucion,
    deleteInstitucion
} from '../controllers/InstitucionCRUD.js';

const router = express.Router();

router.get('/', getAllInstituciones);
router.get('/:cod_DANE', getOneInstitucion);
router.post('/', createInstitucion);
router.put('/:cod_DANE', updateInstitucion);
router.delete('/:cod_DANE', deleteInstitucion);

export default router;

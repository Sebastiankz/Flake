import express from "express";
import { 
    getAllAulas,
    getOneAula,
    createAula,
    updateAula,
    deleteAula
} from "../controllers/AulaCRUD.js";

const router = express.Router();   

router.get('/', getAllAulas);
router.get('/:id_aula', getOneAula);
router.post('/', createAula);
router.put('/:id_aula', updateAula);
router.delete('/:id_aula', deleteAula);

export default router;
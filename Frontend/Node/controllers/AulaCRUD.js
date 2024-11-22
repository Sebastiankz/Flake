import AulaModel from '../models/AulaModel.js';
import InstitucionModel from '../models/InstitucionModel.js';
import { ProfesorModel } from '../models/EnlaceAulaProfesor.js';

export const getAllAulas = async (req, res) => {
    try {
        const aulas = await AulaModel.findAll({
            include: [
                { model: InstitucionModel, attributes: ['nombre', 'localidad'] },
                { model: ProfesorModel, attributes: ['prim_nom', 'prim_apell'] }
            ]
        });
        console.log(aulas.query);

        res.json(aulas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getOneAula = async (req, res) => {
    try {
        const { id_aula } = req.params;
        const aula = await AulaModel.findOne({
            where: { id_aula },
            include: [
                { model: InstitucionModel, attributes: ['nombre', 'localidad'] },
                { model: ProfesorModel, attributes: ['prim_nom', 'prim_apell'] }
            ]
        });

        if (aula) {
            res.json(aula);
        } else {
            res.status(404).json({ message: 'Aula no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const createAula = async (req, res) => {
    try {
        const { id_aula, grad_text, grad_num, jornada, num_grupo, id_profesor, cod_DANE } = req.body;

        const profesor = await ProfesorModel.findByPk(id_profesor);
        if (!profesor) {
            return res.status(400).json({ message: 'El profesor no existe' });
        }

        const institucion = await InstitucionModel.findByPk(cod_DANE);
        if (!institucion) {
            return res.status(400).json({ message: 'La institución no existe' });
        }

        const aula = await AulaModel.create({ id_aula, grad_text, grad_num, jornada, num_grupo, id_profesor, cod_DANE });
        res.status(201).json(aula);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const updateAula = async (req, res) => {
    try {
        const { id_aula } = req.params;
        const { grad_text, grad_num, jornada, num_grupo, id_profesor, cod_DANE } = req.body;

        // Validar si el aula existe
        const aula = await AulaModel.findByPk(id_aula);
        if (!aula) {
            return res.status(404).json({ message: 'Aula no encontrada' });
        }

        // Validar si el profesor existe
        const profesor = await ProfesorModel.findByPk(id_profesor);
        if (!profesor) {
            return res.status(400).json({ message: 'El profesor no existe' });
        }

        // Validar si la institución existe
        const institucion = await InstitucionModel.findByPk(cod_DANE);
        if (!institucion) {
            return res.status(400).json({ message: 'La institución no existe' });
        }

        // Actualizar el aula
        await aula.update({ grad_text, grad_num, jornada, num_grupo, id_profesor, cod_DANE });
        res.status(200).json(aula);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar un aula
export const deleteAula = async (req, res) => {
    try {
        const { id_aula } = req.params;

        // Validar si el aula existe
        const aula = await AulaModel.findByPk(id_aula);
        if (!aula) {
            return res.status(404).json({ message: 'Aula no encontrada' });
        }

        // Eliminar el aula
        await aula.destroy();
        res.status(200).json({ message: 'Aula eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

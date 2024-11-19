import {ProfesorModel} from '../models/UserModelTemp.js';
import AulaModel from '../models/AulaModel.js';
import HorarioModel from '../models/HorarioModel.js';

export const getHorariosByProfesor = async (req, res) => {
    try {
        const { id_profesor } = req.params;

        const profesor = await ProfesorModel.findByPk(id_profesor);
        if (!profesor) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }

        const horarios = await HorarioModel.findAll({
            include: [
                {
                    model: AulaModel,
                    where: { id_profesor }, 
                    attributes: ['id_aula', 'grad_num'], 
                },
            ],
        });
        res.json(horarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los horarios del profesor' });
    }
};

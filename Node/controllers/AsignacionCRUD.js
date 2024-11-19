import AsignacionModel from '../models/AsignacionModel.js';
import AulaModel from '../models/AulaModel.js';
import HorarioModel from '../models/HorarioModel.js';


export const asignacionHorarioToAula = async (req, res) => {
    const { id_aula, id_horario } = req.body;

    try {
        const aula = await AulaModel.findByPk(id_aula);
        const horario = await HorarioModel.findByPk(id_horario);

        if (!aula || !horario) {
            return res.status(404).json({ message: 'Aula o Horario no encontrados' });
        }

        await AsignacionModel.create({
            id_aula,
            id_horario,
        });

        res.status(201).json({ message: 'Horario asignado al aula correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json(
            { message: 'Error al asignar horario al aula',
            error: error.message
            });
    }
};
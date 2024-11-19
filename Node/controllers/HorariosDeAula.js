import AsignacionModel from '../models/AsignacionModel.js';
import HorarioModel from '../models/HorarioModel.js';

export const getHorariosByAula = async (req, res) => {
    const { id_aula } = req.params;

    try {
        const horarios = await AsignacionModel.findAll({
            where: { id_aula },
            include: [
                {
                    model: HorarioModel,
                    attributes: ['id_horario', 'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'dia_semana'],
                },
            ],
        });

        if (horarios.length === 0) {
            return res.status(404).json({ message: 'No hay horarios asignados a esta aula' });
        }

        res.status(200).json(horarios.map(h => h.HorarioModel));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los horarios del aula' });
    }
};

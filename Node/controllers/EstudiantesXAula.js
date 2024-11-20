import { AlumnoModel } from '../models/UserModelTemp.js';

export const getStudentsByAula = async (req, res) => {
    const { id_aula } = req.params;

    try {
        const estudiantes = await AlumnoModel.findAll({
            where: { id_aula }, // Filtra por aula
            attributes: ['id_alumno', 'prim_nom', 'prim_apell', 'edad', 'genero'] // Campos deseados
        });

        if (estudiantes.length === 0) {
            return res.status(404).json({ message: 'No hay estudiantes asignados a esta aula' });
        }

        res.status(200).json(estudiantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los estudiantes del aula' });
    }
};

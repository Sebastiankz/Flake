import EvaluacionModel from '../models/EvaluacionModel.js';

export const registrarActualizarNota = async (req, res) => {
    const { id_horario, notas } = req.body;

    try {
        for (const registro of notas) {
            const { id_alumno, nota } = registro;

            // Verificar si ya existe un registro para este alumno en este horario
            const evaluacionExistente = await EvaluacionModel.findOne({
                where: {
                    id_horario,
                    id_alumno,
                },
            });

            if (evaluacionExistente) {
                // Si el registro existe, actualizar la nota
                await evaluacionExistente.update({ nota });
            } else {
                // Si no existe, crear un nuevo registro de evaluación
                await EvaluacionModel.create({
                    id_horario,
                    id_alumno,
                    nota,
                });
            }
        }

        res.status(200).json({ message: 'Notas registradas o actualizadas correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar o actualizar las notas' });
    }
};

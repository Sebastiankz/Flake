import AsistenciaModel from '../models/AsistenciaModel.js';

export const registrarActualizarAsistencia = async (req, res) => {
    const { id_horario, asistencia } = req.body;

    try {
        for (const registro of asistencia) {
            const { id_alumno, estado } = registro;

            // Verificar si ya existe un registro para este alumno en este horario
            const asistenciaExistente = await AsistenciaModel.findOne({
                where: {
                    id_horario,
                    id_alumno,
                },
            });

            if (asistenciaExistente) {
                // Si el registro existe, actualizarlo
                await asistenciaExistente.update({ estado });
            } else {
                // Si no existe, crear un nuevo registro
                await AsistenciaModel.create({
                    id_profesor: null, // Se puede asignar según sea necesario
                    id_horario,
                    id_alumno,
                    estado,
                });
            }
        }

        res.status(200).json({ message: 'Asistencia registrada o actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar o actualizar la asistencia' });
    }
};

import EvaluacionModel from '../models/EvaluacionModel.js';
import { AlumnoModel } from '../models/UserModelTemp.js';
import HorarioModel from '../models/HorarioModel.js';

// Obtener todas las evaluaciones por horario
export const getEvaluacionesPorHorario = async (req, res) => {
    const { id_horario } = req.params;

    try {
        const evaluaciones = await EvaluacionModel.findAll({
            where: { id_horario },
            include: [
                {
                    model: AlumnoModel,
                    attributes: ['id_alumno', 'prim_nom', 'seg_nom', 'prim_apell', 'seg_apell', 'correo', 'celular'],
                },
            ],
        });

        res.status(200).json(evaluaciones);
    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        res.status(500).json({ message: 'Error al obtener evaluaciones', error: error.message });
    }
};

// Crear evaluaciones
export const crearEvaluaciones = async (req, res) => {
    const { id_horario, evaluaciones } = req.body;

    try {
        const nuevasEvaluaciones = await EvaluacionModel.bulkCreate(
            evaluaciones.map((evaluacion) => ({
                id_evaluacion: `${evaluacion.id_alumno}-${id_horario}`, // Crear una clave compuesta
                id_horario,
                id_alumno: evaluacion.id_alumno,
                nota: evaluacion.nota,
            })),
            { updateOnDuplicate: ['nota'] } // Actualizar la nota si ya existe
        );

        res.status(201).json({ message: 'Evaluaciones creadas/actualizadas exitosamente', data: nuevasEvaluaciones });
    } catch (error) {
        console.error('Error al crear evaluaciones:', error);
        res.status(500).json({ message: 'Error al crear evaluaciones', error: error.message });
    }
};

// Actualizar una evaluación específica
export const actualizarNota = async (req, res) => {
    const { id_evaluacion } = req.params;
    const { nota } = req.body;

    try {
        const evaluacion = await EvaluacionModel.findByPk(id_evaluacion);

        if (!evaluacion) {
            return res.status(404).json({ message: 'Evaluación no encontrada' });
        }

        evaluacion.nota = nota;
        await evaluacion.save();

        res.status(200).json({ message: 'Nota actualizada exitosamente', data: evaluacion });
    } catch (error) {
        console.error('Error al actualizar nota:', error);
        res.status(500).json({ message: 'Error al actualizar nota', error: error.message });
    }
};

// Eliminar una evaluación
export const eliminarEvaluacion = async (req, res) => {
    const { id_evaluacion } = req.params;

    try {
        const evaluacion = await EvaluacionModel.findByPk(id_evaluacion);

        if (!evaluacion) {
            return res.status(404).json({ message: 'Evaluación no encontrada' });
        }

        await evaluacion.destroy();
        res.status(200).json({ message: 'Evaluación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar evaluación:', error);
        res.status(500).json({ message: 'Error al eliminar evaluación', error: error.message });
    }
};

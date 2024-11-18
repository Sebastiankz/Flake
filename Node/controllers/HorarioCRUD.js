import HorarioModel from '../models/HorarioModel.js';
import AñoLectivoModel from '../models/AñoLectivoModel.js';

export const getAllHorarios = async (req, res) => {
    try {
        const horarios = await HorarioModel.findAll();
        res.status(200).json(horarios);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getOneHorario = async (req, res) => {
    try {
        const { id_horario } = req.params;
        const horario = await HorarioModel.findByPk(id_horario);

        if (!horario) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

        res.status(200).json(horario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateHorario = async (req, res) => {
    try {
        const { id_horario } = req.params;
        const { fecha_inicio, fecha_fin, dia_semana, hora_inicio, hora_fin, id_lectivo } = req.body;

        const añoLectivo = await AñoLectivoModel.findByPk(id_lectivo);
        if (!añoLectivo) {
            return res.status(400).json({ message: 'El año lectivo no existe' });
        }

        const horario = await HorarioModel.findByPk(id_horario);
        if (!horario) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

        await horario.update({ fecha_inicio, fecha_fin, dia_semana, hora_inicio, hora_fin, id_lectivo });
        res.status(200).json(horario);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Error al actualizar el horario'
        });
    }
};


export const deleteHorario = async (req, res) => {
    try {
        const { id_horario } = req.params;

        // Buscar el horario
        const horario = await HorarioModel.findByPk(id_horario);
        if (!horario) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

        await horario.destroy();
        res.status(200).json({ message: 'Horario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createHorario = async (req, res) => {
    try {
        const { id_horario, fecha_inicio, fecha_fin, dia_semana, hora_inicio, hora_fin, id_lectivo } = req.body;

        if(!id_horario || !fecha_inicio || !fecha_fin || !dia_semana || !hora_inicio || !hora_fin || !id_lectivo) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const añoLectivo = await AñoLectivoModel.findByPk(id_lectivo);
        if (!añoLectivo) {
            return res.status(400).json({ message: 'El año lectivo no existe' });
        }

        const horario = await HorarioModel.create({ id_horario, fecha_inicio, fecha_fin, dia_semana, hora_inicio, hora_fin, id_lectivo });
        res.status(201).json(horario);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Error al crear el horario'
        });
        }
    };

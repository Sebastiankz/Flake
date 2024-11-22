import { ProfesorModel } from "../models/UserModelTemp.js";
import bcrypt from 'bcrypt';

export const getAllprofesores = async (req, res) => {
    try {
        const profesores = await ProfesorModel.findAll();
        res.json(profesores);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor'
        });
    }
}

export const getOneProfesor = async (req, res) => {
    try {
        const { id_profesor } = req.params;
        const profesor = await ProfesorModel.findOne({
            where: {
                id_profesor
            }
        });
        
        if (profesor) {
            res.json(profesor);
        } else {
            res.status(404).json({
                message: 'Profesor no encontrado'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};

export const createProfesor = async (req, res) => {
    try {
        const {
            id_profesor,
            tipo_id,
            prim_nom,
            seg_nom,
            prim_apell,
            seg_apell,
            username,
            password,
            genero,
            celular,
            edad,
            direccion,
            correo,
            id_cargo
        } = req.body;

        if (!id_profesor || !tipo_id || !prim_nom || !prim_apell || !username || !password || !correo || !direccion) {
            return res.status(400).json({
                message: 'Todos los campos obligatorios deben estar completos'
            });
        }

        const cargoAsignado = id_cargo || 1;

        const crearProfesor = await ProfesorModel.create({
            id_profesor,
            tipo_id,
            prim_nom,
            seg_nom,
            prim_apell,
            seg_apell,
            username,
            password, // Asegúrate de enviar una contraseña cifrada
            genero,
            celular,
            edad,
            direccion,
            correo,
            id_cargo: cargoAsignado
        });

        res.status(201).json({
            message: 'Profesor creado exitosamente',
            data: crearProfesor
        });
    } catch (error) {
        console.error('Error al crear un profesor:', error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

export const updateProfesor = async (req, res) => {
    try {
        const { id_profesor } = req.params;

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const [updatedRows] = await ProfesorModel.update(req.body, {
            where: { id_profesor }
        });

        if (updatedRows === 0) {
            return res.status(404).json({
                message: 'Profesor no encontrado'
            });
        }

        res.status(200).json({
            message: 'Profesor actualizado exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar el profesor:', error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
};


export const deleteProfesor = async (req, res) => {
    try {
        ///profesor/:id)
        const { id_profesor } = req.params;

        // Buscamos el profesor en la base de datos
        const profesor = await ProfesorModel.findOne({
            where: { id_profesor }
        });

        // Si el profesor no existe, devolvemos un error
        if (!profesor) {
            return res.status(404).json({
                message: 'Profesor no encontrado'
            });
        }

        // Eliminamos el registro del profesor
        await profesor.destroy();

        // Devolvemos una respuesta exitosa
        res.status(200).json({
            message: 'Profesor eliminado exitosamente'
        });

    } catch (error) {
        console.log('Error al eliminar el profesor:', error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
};










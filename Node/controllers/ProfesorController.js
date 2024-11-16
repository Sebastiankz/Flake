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

        const {
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

        // Validar que al menos uno de los campos esté presente
        if (
            !tipo_id && !prim_nom && !prim_apell && !username && !password && !correo && !direccion
            && !seg_nom && !seg_apell && !genero && !celular && !edad && !id_cargo
        ) {
            return res.status(400).json({
                message: 'Debe proporcionar al menos un campo para actualizar'
            });
        }

        // Buscar el profesor en la base de datos
        const profesor = await ProfesorModel.findOne({
            where: { id_profesor }
        });

        if (!profesor) {
            return res.status(404).json({
                message: 'Profesor no encontrado'
            });
        }

        let hashedPassword = null;

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Actualizar los datos del profesor
        const updatedProfesor = await profesor.update({
            tipo_id,
            prim_nom,
            seg_nom,
            prim_apell,
            seg_apell,
            username,
            password: hashedPassword || profesor.password, // Mantener la contraseña existente si no se actualiza
            genero,
            celular,
            edad,
            direccion,
            correo,
            id_cargo
        });

        res.status(200).json({
            message: 'Profesor actualizado exitosamente',
            data: updatedProfesor
        });

    } catch (error) {
        console.log('Error al actualizar el profesor:', error);
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










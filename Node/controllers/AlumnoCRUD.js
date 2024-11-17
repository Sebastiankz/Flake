import { AlumnoModel } from "../models/UserModelTemp.js";
import AulaModel from "../models/AulaModel.js";
import InstitucionModel from "../models/InstitucionModel.js";

export const getAllAlumnos = async (req, res) => {
    try {
        const alumnos = await AlumnoModel.findAll();
        res.json(alumnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
}


export const getOneAlumno = async (req, res) => {
    try {
        const { id_alumno } = req.params;
        const alumno = await AlumnoModel.findOne({
            where: {
                id_alumno
            }
        });
        
        if (alumno) {
            res.json(alumno);
        } else {
            res.status(404).json({
                message: 'Alumno no encontrado'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

export const updateAlumno = async (req, res) => {
    try {
        const { id_alumno } = req.params;

        // Verificar si el alumno existe
        const alumno = await AlumnoModel.findOne({
            where: { id_alumno }
        });

        if (!alumno) {
            return res.status(404).json({
                message: 'Alumno no encontrado'
            });
        }

        // Si la contraseña está siendo actualizada, cifrarla
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Actualizar el alumno
        const updatedAlumno = await alumno.update(req.body);

        res.status(200).json({
            message: 'Alumno actualizado exitosamente',
            data: updatedAlumno
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
};


export const deleteAlumno = async (req, res) => {
    try {
        const { id_alumno } = req.params;

        const alumno = await AlumnoModel.findOne({
            where: { id_alumno }
        });

        if (!alumno) {
            return res.status(404).json({
                message: 'Alumno no encontrado'
            });
        }

        await alumno.destroy();

        res.status(200).json({
            message: 'Alumno eliminado exitosamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
};


export const createAlumno = async (req, res) => {
    try {
        const {
            id_alumno,
            tipo_id,
            prim_nom,
            seg_nom,
            prim_apell,
            seg_apell,
            genero,
            fecha_nacimiento,
            estrato,
            celular,
            edad,
            direccion,
            correo,
            id_aula,
            cod_DANE
        } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!tipo_id || !prim_nom || !prim_apell || !seg_apell || !genero || !fecha_nacimiento || !id_aula || !cod_DANE) {
            return res.status(400).json({
                message: 'Todos los campos obligatorios deben ser proporcionados',
                error: error.message
            });
        }

        const aulaExists = await AulaModel.findOne({ where: { id_aula: id_aula } });
        const institucionExists = await InstitucionModel.findOne({ where: { cod_DANE } });

        if (!aulaExists) {
            return res.status(400).json({
                message: 'El aula especificada no existe',
                error: error.message});
        }

        if (!institucionExists) {
            return res.status(400).json({
                message: 'La institución especificada no existe',
                error: error.message
            });
        }
        //Se crea el alumno en la base de datos
        const newAlumno = await AlumnoModel.create({
            id_alumno,
            tipo_id,
            prim_nom,
            seg_nom,
            prim_apell,
            seg_apell,
            genero,
            fecha_nacimiento,
            estrato,
            celular,
            edad,
            direccion,
            correo,
            id_aula,
            cod_DANE
        });

        // Responder con un mensaje de éxito y los datos del nuevo alumno
        res.status(201).json({
            message: 'Alumno creado exitosamente',
            data: newAlumno
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

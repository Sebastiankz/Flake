/*
pasos para registrar asistencia:
0. Obtener las instituciones de un profesor
1. Obtener las aulas de un profesor.
2. Obtener los horarios de un aula específica.
3. Obtener los estudiantes de un aula y registrar la asistencia.
*/

import InstitucionModel from "../models/InstitucionModel";
import AulaModel from "../models/AulaModel";
import HorarioModel from "../models/HorarioModel";
import AsignacionModel from "../models/AsignacionModel";
import { AlumnoModel } from "../models/UserModelTemp";
import AsistenciaModel from "../models/AsistenciaModel"

//Obteniendo instituciones
export const institucionesProfesor = async (req, res) => {
    const {id_profesor} = req.params;

    try{
        const instituciones = await InstitucionModel.findAll({
            include: [
                {
                    model:AulaModel,
                    where: { id_profesor },
                    attributes: [] //por si se necesita algo de aula
                }

            ],
            attributes: ['nombre', 'cod_DANE']
        });

        res.status(200).json(instituciones);

    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Error al obtener las instituciones'})
    }
};

//Obtener las aulas del profesor teniendo en cuenta la institucion

export const obtenerAulasProfesor = async (req, res) => {

    const { id_profesor, cod_DANE } = req.params

    try{
        const aulas = AulaModel.findAll({
            where: {
                cod_DANE,
                id_profesor
            },
            attributes: ['id_aula', 'grad_num', 'jornada', 'num_grupo']
        });
        res.status(200).json(aulas);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las aulas' });
    }
}

//Obteniendo los horarios del aula seleccionada

export const obtenerHorariosAula = async (res,req) => {
    const {id_aula} = req.params;

    try{
        const horarios = await HorarioModel.findAll({
            include: [
                {
                    model:AsignacionModel,
                    where: {id_aula},
                    attributes: [] //por si se necesitan más cosas de la tabla asignación
                }
            ]
        });
        attributes: [
            'id_horario',
            'fecha_inicio',
            'fecha_fin',
            'dia_semana',
            'hora_inicio',
            'hora_fin'
        ]
        res.status(200).json(horarios);

    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Error al obtener los horarios del aula'})
    }
}


export const obtenerEstudiantesPorHorario = async (req, res) => {
    const { id_horario } = req.params;

    try {
        // Obtener el horario junto con el aula asociada
        const horario = await HorarioModel.findByPk(id_horario, {
            include: {
                model: AulaModel,
                attributes: ['id_aula', 'grad_text', 'grad_num', 'num_grupo', 'jornada'], // Agregar atributos necesarios
            },
        });

        // Verificar si el horario existe
        if (!horario || !horario.Aula) {
            return res.status(404).json({ message: 'Horario o aula no encontrado' });
        }

        const aula = horario.Aula;

        // Obtener los estudiantes relacionados con el aula
        const estudiantes = await AlumnoModel.findAll({
            where: { id_aula: aula.id_aula },
            attributes: ['id_alumno', 'nombre', 'primer_apellido'],
            include: {
                model: AsistenciaModel,
                where: { id_horario },
                required: false, // Permitir estudiantes sin registro de asistencia
                attributes: ['estado'],
            },
        });

        res.status(200).json({
            aula: {
                id_aula: aula.id_aula,
                nombre: `${aula.grad_text} ${aula.grad_num} - Grupo ${aula.num_grupo}`,
                jornada: aula.jornada,
            },
            estudiantes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener estudiantes', error: error.message });
    }
};


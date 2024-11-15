import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import { AlumnoModel, ProfesorModel } from './UserModelTemp.js';
import { HorarioModel } from './HorarioModel.js';


const AsistenciaModel = db.define('asistencias', {
    id_asistencia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Alumnos', // Nombre de la tabla referenciada
            key: 'id_alumno'
        },
        onDelete: 'CASCADE'
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Presente', 'Ausente', 'Tarde', 'Justificado'),
        allowNull: false
    },
    id_profesor:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Profesores', // Nombre de la tabla referenciada
            key: 'id_profesor'
        },
        onDelete: 'CASCADE'
    },
    id_horario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Horarios', // Nombre de la tabla referenciada
            key: 'id_horario'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'Asistencias', // Nombre de la tabla en la base de datos
    timestamps: false         // Desactivar los timestamps por defecto
});

AsistenciaModel.belongsTo(AlumnoModel, { foreignKey: 'id_alumno' });
AsistenciaModel.belongsTo(HorarioModel, { foreignKey: 'id_horario' });
AsistenciaModel.belongsTo(ProfesorModel, { foreignKey: 'id_profesor' });

export default AsistenciaModel;

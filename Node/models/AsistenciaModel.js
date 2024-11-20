import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import { AlumnoModel, ProfesorModel } from './UserModelTemp.js';
import HorarioModel from './HorarioModel.js'; 

const AsistenciaModel = db.define('Asistencias', {
    id_asistencia: {
        type: DataTypes.STRING, // Coincide con VARCHAR(50) en MySQL
        primaryKey: true,
        allowNull: false,
    },
    estado: {
        type: DataTypes.CHAR(1), // Coincide con CHAR(1) en MySQL
        allowNull: false,
    },
    id_profesor: {
        type: DataTypes.INTEGER, // Coincide con INT(20) en MySQL
        allowNull: false,
        references: {
            model: ProfesorModel,
            key: 'id_profesor',
        },
        onDelete: 'CASCADE',
    },
    id_horario: {
        type: DataTypes.STRING, // Coincide con VARCHAR(50) en MySQL
        allowNull: false,
        references: {
            model: HorarioModel,
            key: 'id_horario',
        },
        onDelete: 'RESTRICT',
    },
    id_alumno: {
        type: DataTypes.INTEGER, // Coincide con INT(20) en MySQL
        allowNull: false,
        references: {
            model: AlumnoModel,
            key: 'id_alumno',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'Asistencias', // Nombre de la tabla en MySQL
    timestamps: false,       // No usar columnas createdAt y updatedAt
});

AsistenciaModel.belongsTo(AlumnoModel, { foreignKey: 'id_alumno' });
AsistenciaModel.belongsTo(HorarioModel, { foreignKey: 'id_horario' });
AsistenciaModel.belongsTo(ProfesorModel, { foreignKey: 'id_profesor' });

export default AsistenciaModel;

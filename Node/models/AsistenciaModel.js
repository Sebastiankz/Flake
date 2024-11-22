import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import { AlumnoModel, ProfesorModel } from './UserModelTemp.js';
import HorarioModel from './HorarioModel.js'; 

const AsistenciaModel = db.define('Asistencias', {
    id_asistencia: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
    },
    estado_alumno: {
        type: DataTypes.ENUM('Presente', 'Ausente', 'Tarde'), 
        allowNull: false,
    },
    estado_profesor: {
        type: DataTypes.ENUM('Presente', 'Ausente', 'Tarde'), 
        allowNull: false,
    },
    motivo_inasistencia_profesor: {
        type: DataTypes.STRING(500), 
        allowNull: true, 
    },
    id_profesor: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: ProfesorModel,
            key: 'id_profesor',
        },
        onDelete: 'CASCADE',
    },
    id_horario: {
        type: DataTypes.STRING(50), 
        allowNull: false,
        references: {
            model: HorarioModel,
            key: 'id_horario',
        },
        onDelete: 'RESTRICT',
    },
    id_alumno: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: AlumnoModel,
            key: 'id_alumno',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'Asistencias',
    timestamps: false, 
});

AsistenciaModel.belongsTo(AlumnoModel, { foreignKey: 'id_alumno' });
AsistenciaModel.belongsTo(HorarioModel, { foreignKey: 'id_horario' });
AsistenciaModel.belongsTo(ProfesorModel, { foreignKey: 'id_profesor' });

export default AsistenciaModel;


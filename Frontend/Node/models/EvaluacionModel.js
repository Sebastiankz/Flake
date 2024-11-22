import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import HorarioModel from './HorarioModel.js';
import { AlumnoModel } from './UserModelTemp.js';

const EvaluacionModel = db.define('evaluaciones', {
    id_evaluacion: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    nota: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false
    },
    id_horario: {
        type: DataTypes.STRING(50),
        references: {
            model: HorarioModel,
            key: 'id_horario'
        },
        onUpdate: 'RESTRICT',
        allowNull: false
    },
    id_alumno: {
        type: DataTypes.INTEGER(20),
        references: {
            model: AlumnoModel,
            key: 'id_alumno'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false
    }
}, {
    tableName: 'evaluaciones',
    timestamps: false
});

// Relaciones entre modelos
EvaluacionModel.belongsTo(HorarioModel, { foreignKey: 'id_horario' });
EvaluacionModel.belongsTo(AlumnoModel, { foreignKey: 'id_alumno' });

export default EvaluacionModel;

import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import AulaModel from './AulaModel.js';
import HorarioModel from './HorarioModel.js';

const AsignacionModel = db.define('asignaciones', {
    id_horario: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: HorarioModel,
            key: 'id_horario'
        }
    },
    id_aula: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: AulaModel,
            key: 'id_aula'
        }
    }
}, {
    tableName: 'asignaciones',
    timestamps: false
});

// Configurar la relación muchos a muchos
AulaModel.belongsToMany(HorarioModel, {
    through: AsignacionModel,
    foreignKey: 'id_aula',
    otherKey: 'id_horario'
});

HorarioModel.belongsToMany(AulaModel, {
    through: AsignacionModel,
    foreignKey: 'id_horario',
    otherKey: 'id_aula'
});

export default AsignacionModel;

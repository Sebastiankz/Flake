import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import AñoLectivoModel from './AñoLectivoModel.js';

const HorarioModel = db.define('Horarios', {
    id_horario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dia_semana: {
        type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'),
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    id_lectivo: {
        type: DataTypes.INTEGER,
        references: {
            model: AñoLectivoModel,
            key: 'id_año'
        },
        onDelete: 'RESTRICT',
        allowNull: false
    }
}, {
    tableName: 'Horarios', // Nombre de la tabla en la base de datos
    timestamps: false      // Desactivar los timestamps por defecto
});

HorarioModel.belongsTo(AñoLectivoModel, {foreignKey: 'id_lectivo'});

export default HorarioModel;
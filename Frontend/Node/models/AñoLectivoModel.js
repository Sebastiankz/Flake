import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const AñoLectivoModel = db.define('AñoLectivo', { // Cambiado a coincidencia exacta con la base de datos
    id_lectivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    fecha_inicio_week: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin_week: {
        type: DataTypes.DATE,
        allowNull: false
    },
    semana_lectiva: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semana_real: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bloque_lectivo: {
        type: DataTypes.ENUM('1', '2', '3', '4'),
        allowNull: false
    }
}, {
    tableName: 'año_lectivo', // Debe coincidir con la base de datos
    timestamps: false
});

export default AñoLectivoModel;

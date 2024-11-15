import { DataTypes, ENUM } from 'sequelize';
import db from '../database/db.js';

const AñoLectivoModel = db.define('año_lectivo', {
    id_año: {
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
    semana_lectiva: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semana_real: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bloque_lectivo: {
        type: ENUM('1', '2', '3', '4'),
        allowNull: false
    }
    
}, {
    tableName: 'AñoLectivo', // Nombre de la tabla en la base de datos
    timestamps: false        // Desactivar los timestamps por defecto
});

export default AñoLectivoModel;
import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const InstitucionModel = db.define('instituciones', {
    cod_DANE: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    rector: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'Instituciones', // Nombre de la tabla en la base de datos
    timestamps: false           // Desactivar los timestamps por defecto
});

export default InstitucionModel;
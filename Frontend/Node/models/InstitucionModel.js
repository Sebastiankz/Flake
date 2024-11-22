import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const InstitucionModel = db.define('instituciones', {
    cod_DANE: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    numero: {  // Se agregó este campo
        type: DataTypes.STRING(100),
        allowNull: false
    },
    localidad: {  // Se agregó este campo
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre_rector: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    barrio: {  // Se agregó este campo
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'Instituciones', // Nombre de la tabla en la base de datos
    timestamps: false           // Desactivar los timestamps por defecto
});

export default InstitucionModel;
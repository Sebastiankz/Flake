import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const InstitucionModel = db.define('instituciones', {
    cod_DANE: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    localidad: {
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
    barrio: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'Instituciones',
    timestamps: false
});

export default InstitucionModel;

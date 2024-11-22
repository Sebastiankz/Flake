import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const CargoModel = db.define('cargos', {
    id_cargo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'Cargos',
    timestamps: false,
});

export default CargoModel; // Verifica esta línea para exportar correctamente


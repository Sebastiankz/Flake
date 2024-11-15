// import of the database connection
import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const cargoModel = db.define('cargos', {
    id_cargo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    }

    
},
{
    tablename: 'Cargos',
    timestamps: false
});

export default cargoModel;
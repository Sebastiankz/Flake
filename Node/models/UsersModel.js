// import of the database connection
import db from '../database/db.js';
import { DataTypes } from 'sequelize';
await db.sync();

const UserModel = db.define('usuarios', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: { type: DataTypes.STRING, },
    correo: { type: DataTypes.STRING, },
    edad: { type: DataTypes.INTEGER, }
}, {
    tableName: 'usuarios',  // Corrige aquí la propiedad
    timestamps: false       // Desactiva createdAt y updatedAt
});

export default UserModel;
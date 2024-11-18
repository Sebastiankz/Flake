import { Sequelize } from "sequelize";

const db = new Sequelize('flake_v2', 'root', 'grupo4', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;
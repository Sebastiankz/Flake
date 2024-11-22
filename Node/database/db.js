import { Sequelize } from "sequelize";

const db = new Sequelize('flake', 'root', 'grupo4', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;
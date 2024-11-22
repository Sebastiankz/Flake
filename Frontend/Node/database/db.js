import { Sequelize } from "sequelize";

const db = new Sequelize('flake', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch((error) => console.error('Unable to connect to the database:', error));

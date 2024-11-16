import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import InstitucionModel from './InstitucionModel.js';

const AulaModel = db.define('aulas', {
    id_aula: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false
    },
    grad_text: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    grad_num: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jornada: {
        type: DataTypes.ENUM('Unica', 'Mañana', 'Tarde'),
        allowNull: false
    },
    num_grupo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    id_profesor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Profesores', // Nombre de la tabla referenciada
            key: 'id_profesor'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    },
    cod_DANE: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'Instituciones', // Nombre de la tabla referenciada
            key: 'cod_DANE'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    }
}, {
    tableName: 'Aulas', // Nombre de la tabla en la base de datos
    timestamps: false   // Desactivar los timestamps por defecto
});

AulaModel.belongsTo(InstitucionModel, { foreignKey: 'cod_DANE' });

export default AulaModel;
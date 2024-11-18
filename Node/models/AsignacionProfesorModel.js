import { DataTypes } from "sequelize";
import db from "../database/db.js";
import institucionModel from "./InstitucionModel.js";
import { ProfesorModel } from "./UserModelTemp.js";

const AsignacionProfesorModel = db.define('asignacion_tutor', {
    cod_DANE: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        references: {
            model: 'Instituciones',
            key: 'cod_DANE'
        },
        allowNull: false
    },
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Profesores',
            key: 'id_profesor'
        },
        allowNull: false
    }
},
{
    tableName: 'asignacion_tutor',
    timestamps: false
});


institucionModel.belongsToMany(ProfesorModel, {
    through: AsignacionProfesorModel,
    foreignKey: 'cod_DANE',
    otherKey: 'id_profesor'
});

ProfesorModel.belongsToMany(institucionModel, {
    through: AsignacionProfesorModel,
    foreignKey: 'id_profesor',
    otherKey: 'cod_DANE'
});
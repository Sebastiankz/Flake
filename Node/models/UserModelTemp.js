// import of the database connection
import db from '../database/db.js';
import  DataTypes from 'sequelize';
import  CargoModel  from './CargoModel.js';
import  AulaModel   from './AulaModel.js';
import  InstitucionModel  from './InstitucionModel.js';

const AdministradorModel = db.define('administradores', {
    id_administrador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    tipo_id: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    prim_nom: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    seg_nom: {
        type: DataTypes.STRING(50),
    },
    prim_apell: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    seg_apell: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    genero: {
        type: DataTypes.CHAR(1)
    },
    celular: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_cargo: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Cargos', // Nombre de la tabla referenciada
            key: 'id_cargo'
        }
    }
}, {
    tableName: 'Administradores', // Nombre de la tabla en la base de datos
    timestamps: false             // Desactivar los timestamps por defecto
});

AdministradorModel.belongsTo(CargoModel, { foreignKey: 'id_cargo' });

const ProfesorModel = db.define('Profesores', {
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    tipo_id: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    prim_nom: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    seg_nom: {
        type: DataTypes.STRING(50),
    },
    prim_apell: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    seg_apell: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    genero: {
        type: DataTypes.CHAR(1)
    },
    celular: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_cargo: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Cargos', // Nombre de la tabla referenciada
            key: 'id_cargo'
        }
    }
}, {
    tableName: 'Profesores', // Nombre de la tabla en la base de datos
    timestamps: false             // Desactivar los timestamps por defecto
});

ProfesorModel.belongsTo(CargoModel, { foreignKey: 'id_cargo' });

const AlumnoModel = db.define('Alumnos', {
    id_alumno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    tipo_id: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    prim_nom: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    seg_nom: {
        type: DataTypes.STRING(50),
    },
    prim_apell: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    seg_apell: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    genero:{
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estrato:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    genero: {
        type: DataTypes.CHAR(1)
    },
    celular: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_aula: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Aulas', // Nombre de la tabla referenciada
            key: 'id_curso'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },
    cod_DANE: {
        type: DataTypes.STRING(50),
        references: {
            model: 'Instituciones', // Nombre de la tabla referenciada
            key: 'cod_DANE'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    }

}, {
    tableName: 'Alumnos', // Nombre de la tabla en la base de datos
    timestamps: false     // Desactivar los timestamps por defecto
});

AlumnoModel.belongsTo(AulaModel, { foreignKey: 'id_curso' });
AlumnoModel.belongsTo(InstitucionModel, { foreignKey: 'cod_DANE' });

export { AdministradorModel, ProfesorModel, AlumnoModel };
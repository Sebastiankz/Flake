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
        type: DataTypes.CHAR(2), 
        allowNull: false
    },
    prim_nom: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    seg_nom: {
        type: DataTypes.STRING(50),
        allowNull: true // Opcional
    },
    prim_apell: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    seg_apell: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    genero: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estrato: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    celular: {
        type: DataTypes.INTEGER,
        allowNull: true // Opcional
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: true // Opcional
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: true // Opcional
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: true // Opcional
    },
    id_aula: {
        type: DataTypes.STRING(50), 
        references: {
            model: 'Aulas',
            key: 'id_aula'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        allowNull: false
    }
}, {
    tableName: 'Alumnos',
    timestamps: false
});

AlumnoModel.belongsTo(AulaModel, { foreignKey: 'id_aula' });


export { AdministradorModel, ProfesorModel, AlumnoModel };
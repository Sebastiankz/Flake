CREATE DATABASE flake;
USE flake;

CREATE TABLE Cargo (
id_cargo INT(1) PRIMARY KEY,
nombre_cargo VARCHAR(20) NOT NULL
);

CREATE TABLE Administradores (
id_administrador INT(20) PRIMARY KEY,
tipo_id VARCHAR(20) NOT NULL,
prim_nom VARCHAR(50) NOT NULL,
seg_nom VARCHAR (50),
prim_apell VARCHAR (50) NOT NULL,
seg_apell VARCHAR (50) NOT NULL,
username VARCHAR(50) UNIQUE NOT NULL,
password  VARCHAR(100) NOT NULL, 
genero CHAR(1),
celular INT(10) NOT NULL,
edad INT(2) NOT NULL,
direccion  VARCHAR(100) NOT NULL,
correo VARCHAR(100) NOT NULL,
id_cargo INT(1),
FOREIGN KEY (id_cargo) REFERENCES Cargo(id_cargo)
);

CREATE TABLE Profesores (
id_profesor INT(20) PRIMARY KEY,
tipo_id VARCHAR(20) NOT NULL,
prim_nom VARCHAR(50) NOT NULL,
seg_nom VARCHAR (50),
username VARCHAR(50) UNIQUE NOT NULL,
password  VARCHAR(100) NOT NULL, 
prim_apell VARCHAR (50) NOT NULL,
seg_apell VARCHAR (50) NOT NULL,
genero CHAR(1),
celular INT(10) NOT NULL,
edad INT(2) NOT NULL,
direccion  VARCHAR(100) NOT NULL,
correo VARCHAR(100) NOT NULL,
id_cargo INT(1),
FOREIGN KEY (id_cargo) REFERENCES Cargo(id_cargo)
);

CREATE TABLE Instituciones (
cod_DANE VARCHAR(50) PRIMARY KEY,
numero 	VARCHAR(100) NOT NULL,
localidad VARCHAR(50) NOT NULL,
nombre VARCHAR(100) NOT NULL,
nombre_rector VARCHAR(50) NOT NULL,
direccion VARCHAR(100) NOT NULL,
barrio  VARCHAR(50) NOT NULL
);

CREATE TABLE Aulas (
id_aula VARCHAR(20)  PRIMARY KEY,
grad_text VARCHAR(10) NOT NULL,
grad_num INT(5) NOT NULL,
jornada ENUM('Unica', 'Mañana', 'Tarde') NOT NULL,
num_grupo VARCHAR(50) NOT NULL,
id_profesor INT(20) NOT NULL,
cod_DANE VARCHAR(50) NOT NULL,
FOREIGN KEY (cod_DANE) REFERENCES Instituciones(cod_DANE)
ON DELETE RESTRICT
ON UPDATE CASCADE,
FOREIGN KEY (id_profesor) REFERENCES Profesores(id_profesor)
ON DELETE RESTRICT
ON UPDATE CASCADE
);

CREATE TABLE Alumnos (
id_alumno INT(20) PRIMARY KEY,
tipo_id CHAR(2) NOT NULL,
prim_nom VARCHAR(50) NOT NULL,
seg_nom VARCHAR (50),
prim_apell VARCHAR (50) NOT NULL,
seg_apell VARCHAR (50) NOT NULL,
genero CHAR(1) NOT NULL,
edad INT(2),
id_aula VARCHAR(50) NOT NULL,
FOREIGN KEY (id_aula) REFERENCES Aulas(id_aula)
ON DELETE RESTRICT
ON UPDATE CASCADE
);

CREATE TABLE Año_lectivo (
id_lectivo INT PRIMARY KEY,
fecha_inicio_week DATE NOT NULL,
semana_lectiva INT NOT NULL,
semana_real INT NOT NULL,
fecha_fin_week DATE NOT NULL,
bloque_lectivo ENUM('1','2','3','4') NOT NULL
);

CREATE TABLE Horarios (
id_horario VARCHAR(50) PRIMARY KEY,
fecha_hora_inicio DATETIME NOT NULL,
fecha_hor_fin DATETIME NOT NULL,
dia_semana ENUM('Lunes','Martes','Miercoles','Jueves','Viernes') NOT NULL,
id_lectivo INT NOT NULL,
FOREIGN KEY (id_lectivo) REFERENCES año_lectivo(id_lectivo)
ON DELETE RESTRICT
);

CREATE TABLE Asistencias (
id_asistencia VARCHAR(50) primary key,
estado_alumno ENUM('Presente', 'Ausente', 'Tarde') NOT NULL,
estado_profesor ENUM('Presente', 'Ausente', 'Tarde') NOT NULL,
id_profesor INT(20) NOT NULL,
id_horario VARCHAR(50) NOT NULL,
id_alumno INT(20) NOT NULL,
motivo_inasistencia_profesor VARCHAR(500),
FOREIGN KEY (id_profesor) REFERENCES profesores(id_profesor)
ON DELETE CASCADE,
FOREIGN KEY (id_horario) REFERENCES horarios(id_horario)
ON DELETE RESTRICT,
FOREIGN KEY (id_alumno) REFERENCES alumnos(id_alumno)
ON DELETE CASCADE	
);

CREATE TABLE evaluaciones (
    id_evaluacion VARCHAR(50) PRIMARY KEY,
    nota DECIMAL(3,2) NOT NULL,
    id_horario VARCHAR(50) NOT NULL,
    id_alumno INT NOT NULL,
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario)
        ON UPDATE RESTRICT,
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id_alumno)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE clases(
id_horario VARCHAR(50) NOT NULL,
id_aula VARCHAR(20) NOT NULL,
PRIMARY KEY (id_horario, id_aula),
FOREIGN KEY (id_horario) REFERENCES horarios(id_horario),
FOREIGN KEY (id_aula) REFERENCES aulas(id_aula)
);
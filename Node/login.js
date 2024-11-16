import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './database/db.js';
dotenv.config({path: './security.env' });
//import verifyToken from './Middleware/verifyToken.js'; algo que estoy probando

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        let query;

        // Determinar la consulta según el rol
        if (role === 'admin') {
            query = `SELECT * FROM Administradores WHERE correo = :username AND password = :password`;
        } else if (role === 'instructor') {
            query = `SELECT * FROM Profesores WHERE correo = :username AND password = :password`;
        } else {
            return res.status(400).json({ message: 'Rol no válido' });
        }

        // Ejecutar la consulta con Sequelize
        const [rows] = await db.query(query, {
            replacements: { username, password }, // Parámetros seguros
            type: db.QueryTypes.SELECT,
        });

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = rows[0];

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id_administrador || user.id_profesor, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;


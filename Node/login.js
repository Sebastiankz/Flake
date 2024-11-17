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

        // Determinar la tabla según el rol
        if (role === 'Administrador') {
            query = `
                SELECT a.id_administrador AS id, a.username, c.nombre_cargo 
                FROM Administradores a
                JOIN Cargo c ON a.id_cargo = c.id_cargo
                WHERE a.username = :username AND a.password = :password
            `;
        } else if (role === 'Profesor') {
            query = `
                SELECT p.id_profesor AS id, p.username, c.nombre_cargo 
                FROM Profesores p
                JOIN Cargo c ON p.id_cargo = c.id_cargo
                WHERE p.username = :username AND p.password = :password
            `;
        } else {
            return res.status(400).json({ message: 'Rol no válido' });
        }

        // Ejecutar la consulta con sequelize
        const [rows] = await db.query(query, {
            replacements: { username, password },
            type: db.QueryTypes.SELECT,
        });

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = rows[0];

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, role: user.nombre_cargo },
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

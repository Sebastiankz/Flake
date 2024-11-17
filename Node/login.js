import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './database/db.js';
dotenv.config({path: './security.env' });
//import verifyToken from './Middleware/verifyToken.js'; algo que estoy probando


const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let query;

        // Determinar la consulta SQL según el rol
        if (role === 'Administrador') {
            query = `
                SELECT a.id_administrador AS id, a.correo AS email, c.nombre_cargo 
                FROM Administradores a
                JOIN Cargo c ON a.id_cargo = c.id_cargo
                WHERE a.correo = :email AND a.password = :password
            `;
        } else if (role === 'Profesor') {
            query = `
                SELECT p.id_profesor AS id, p.correo AS email, c.nombre_cargo 
                FROM Profesores p
                JOIN Cargo c ON p.id_cargo = c.id_cargo
                WHERE p.correo = :email AND p.password = :password
            `;
        } else {
            return res.status(400).json({ message: 'Rol no válido' });
        }

        // Ejecutar la consulta con Sequelize
        const [rows] = await db.query(query, {
            replacements: { email, password },
            type: db.QueryTypes.SELECT,
        });

        // Verificar si se encontraron resultados
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = rows[0];

        // Generar el token JWT
        const token = jwt.sign(
            { id: user.id, role: user.nombre_cargo },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        // Responder con el token generado
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;

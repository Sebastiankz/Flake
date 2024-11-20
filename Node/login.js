import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './database/db.js';
dotenv.config({path: './security.env' });
//import verifyToken from './Middleware/verifyToken.js'; algo que estoy probando


const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario en las tablas correspondientes
        let user = await AdministradorModel.findOne({
            where: { correo: email, password },
            include: { model: CargoModel, attributes: ['nombre_cargo'] }
        });

        if (!user) {
            user = await ProfesorModel.findOne({
                where: { correo: email, password },
                include: { model: CargoModel, attributes: ['nombre_cargo'] }
            });
        }

        // Si no se encuentra el usuario, retornar error
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Extraer datos del usuario
        const { id_administrador, id_profesor, correo, cargo } = user;
        const role = cargo.nombre_cargo; // Administrador o Profesor
        const id = id_administrador || id_profesor; // Tomar el ID según el tipo de usuario

        // Generar el token JWT
        const token = jwt.sign(
            { id, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        // Retornar el token
        res.status(200).json({ token, role });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;

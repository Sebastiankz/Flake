import express from 'express';
import { AdministradorModel, ProfesorModel } from './models/UserModelTemp.js'; // Modelos de usuario
import CargoModel from './models/CargoModel.js'; // Modelo de cargo

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user;
        let role;

        // Buscar primero en la tabla de profesores
        user = await ProfesorModel.findOne({
            where: { username, password },
            include: { model: CargoModel, attributes: ['nombre'] }
        });

        if (user) {
            role = 'Profesor';
            console.log('Usuario encontrado en la tabla de Profesores:', user.username);
        }

        // Si no lo encontramos en Profesores, buscar en Administradores
        if (!user) {
            user = await AdministradorModel.findOne({
                where: { username, password },
                include: { model: CargoModel, attributes: ['nombre'] }
            });

            if (user) {
                role = 'Administrador';
                console.log('Usuario encontrado en la tabla de Administradores:', user.username);
            } else {
                // Si no se encuentra el usuario
                console.log('Credenciales incorrectas');
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        }

        // Responder con los datos del usuario
        res.status(200).json({
            success: true,
            user: {
                username: user.username,
                full_name: `${user.prim_nom} ${user.seg_nom} ${user.prim_apell} ${user.seg_apell}`,
                id_cargo: user.id_cargo,  // Retornamos el id_cargo para determinar el rol en el frontend
            }
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


export default router;

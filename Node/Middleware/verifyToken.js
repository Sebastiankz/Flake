import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Obtener el token del header 'Authorization'
    const token = req.headers['authorization'];

    // Si no se proporciona el token, devolver error 403
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token utilizando la clave secreta
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
        req.user = decoded; // Guardamos la información del usuario decodificado en req.user
        next(); // Llamar a la siguiente función en la cadena de middlewares
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

export default verifyToken;

import UserModel from "../models/UsersModel.js";


//methods for CRUD operations

// Get all registers
export const getAllRegisters = async (req, res) => {
    try {
        const registers = await UserModel.findAll();
        res.status(200).json(registers);  // 200 para respuesta exitosa
    } catch (error) {
        res.status(500).json({  // errores de servidor
            message: error.message
        });
    }
}

// Show one register
export const getOneRegister = async (req, res) => {
    try {
        const register = await UserModel.findOne({
            where: {
                id: req.params.id
            }
        });
        
        if (register) {
            res.status(200).json(register);  // Devuelve el registro si se encuentra
        } else {
            res.status(404).json({  // Devuelve 404 si no se encuentra el registro
                message: 'Register not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//crear un registro
export const createRegister = async (req, res) => {
    try {
        const register = await UserModel.create(req.body);
        res.status(201).json(register);  // 201 para recurso creado
    } catch (error) {
        res.status(500).json({
            message: error.message            
        });
    }
}

//update a register
export const updateRegister = async (req, res) => {
    try {
        await UserModel.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        if (register) {
            await register.update(req.body);
            res.status(200).json(register);  // 200 para respuesta exitosa
        } else {
            res.status(404).json({
                message: 'Register not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


//delete a register
export const deleteRegister = async (req, res) => {
    try {
        const rowsDeleted = await UserModel.destroy({
            where: {
                id: req.params.id
            }
        });
        
        if (rowsDeleted > 0) {
            res.status(200).json({
                message: 'Register deleted'
            });
        } else {
            res.status(404).json({
                message: 'Register not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

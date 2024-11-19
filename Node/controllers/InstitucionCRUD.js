import InstitucionModel from "../models/InstitucionModel.js";


export const getAllInstituciones = async (req, res) => {
    try {
        const instituciones = await InstitucionModel.findAll();
        res.status(200).json(instituciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las instituciones' });
    }
};

export const getOneInstitucion = async (req, res) => {
    try {
        const { cod_DANE } = req.params;
        const institucion = await InstitucionModel.findByPk(cod_DANE);

        if (!institucion) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }

        res.status(200).json(institucion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la institución' });
    }
};


export const createInstitucion = async (req, res) => {
    try {
        const { cod_DANE, numero, localidad, nombre, direccion, barrio } = req.body;

        const institucionExistente = await InstitucionModel.findByPk(cod_DANE);
        if (institucionExistente) {
            return res.status(400).json({ message: 'Ya existe una institución con este código DANE' });
        }

        const nuevaInstitucion = await InstitucionModel.create({ 
            cod_DANE, numero, localidad, nombre, direccion, barrio 
        });

        res.status(201).json(nuevaInstitucion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la institución' });
    }
};

export const updateInstitucion = async (req, res) => {
    try {
        const { cod_DANE } = req.params;
        const { numero, localidad, nombre, direccion, barrio } = req.body;

        const institucion = await InstitucionModel.findByPk(cod_DANE);

        if (!institucion) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }

        await institucion.update({ numero, localidad, nombre, direccion, barrio });
        res.status(200).json({ message: 'Institución actualizada correctamente', institucion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la institución' });
    }
};

export const deleteInstitucion = async (req, res) => {
    try {
        const { cod_DANE } = req.params;

        const institucion = await InstitucionModel.findByPk(cod_DANE);

        if (!institucion) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }

        await institucion.destroy();
        res.status(200).json({ message
        : 'Institución eliminada correctamente' });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la institución' });
    }
};
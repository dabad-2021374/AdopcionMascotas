'use strict'

import Animal from './animal.model.js'

export const registerAnimal = async (req, res) => {
    try {
        //Capturar el formulario (body)
        let data = req.body
        console.log(data)
        //Guardar la información en la BD
        let animal = new Animal(data)
        await animal.save()
        //Responder al usuario
        return res.send({ message: `Registered successfully, can be logged with name ${animal.name}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering animal', err: err })
    }
}

export const getAnimals = async (req, res) => {
    try {
        let animals = await Animal.find();
        return res.send({animals});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching animals', err: err });
    }
}

export const deleteA = async (req, res) => {
    try {
        //Obtener el Id
        let { id } = req.params
        //Validar si está logeado y es el mismo X No lo vemos hoy X
        //Eliminar (deleteOne (solo elimina no devuelve el documento) / findOneAndDelete (Me devuelve el documento eliminado))
        let deletedAnimal = await Animal.findOneAndDelete({ _id: id })
        //Verificar que se eliminó
        if (!deletedAnimal) return res.status(404).send({ message: 'Animal not found and not deleted' })
        //Responder
        return res.send({ message: `Animal with username ${deletedAnimal.name} deleted successfully` }) //status 200
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting animal' })
    }
}

export const searchAnimal = async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findOne({ _id: id });
    res.status(200).json({
        animal
    })
}

export const updateA = async (req, res) => { //Datos generales (No password)
    try {
        //Obtener el id del usuario a actualizar
        let { id } = req.params
        //Obtener los datos a actualizar 
        let data = req.body
        //Validar si data trae datos
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update' })
        //Validar si tiene  permisos (tokenizacion) X Hoy no lo veremos X
        //Actualizar (DB)
        let updateAnimal = await Animal.findOneAndUpdate(
            { _id: id },  //ObjectsId <- hexadecimales (Hora sys, Version de mongo, Llave privada...)
            data,
            {new: true} //Objeto de la DB ya actualizado
        )
        //Validar la actualizacion
        if (!updateAnimal) return res.status(401).send({ message: 'Animal not found and not update' })
        //Respondo al usuario
        return res.send({ message: 'Update Animal', updateAnimal })
    } catch (err) {
        console.error(err)
        if(err.keyValue.name) return res.status(400).send({message: `name ${err.keyValue.name} is alredy taken`})
        return res.status(500).send({ message: 'Error updating account' })
    }
}
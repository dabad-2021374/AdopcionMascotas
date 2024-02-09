'use strict' 

import Animal from './animal.model'

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
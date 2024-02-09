'use strict' //Modo estricto

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from './utils/validator.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const register = async (req, res) => {
    try {
        //Capturar el formulario (body)
        let data = req.body
        console.log(data)
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la información en la BD
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const login = async (req, res) => {
    try {
        //Capturar los datos (body)
        let { username, password } = req.body
        let user = await User.findOne({ username }) //Buscar un solo registro
        //Verificar que la contraseña coincida
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Responder al usuario
            return res.send({ message: `Welcome ${loggedUser.name}`, loggedUser })
        }
        return res.status(404).send({ message: 'User not found' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

/**
export const updatePassword = async (req, res) => {
    try {
        // Capturar los datos (body) necesarios para actualizar la contraseña
        const { username, oldPassword, newPassword } = req.body;
        // Buscar al usuario en la base de datos
        let user = await User.findOne({ username });
        // Verificar si el usuario existe y si la contraseña antigua es valida
        if (user && await checkPassword(oldPassword, user.password)) {
            // Encriptar la nueva contraseña
            const encryptedNewPassword = await encrypt(newPassword);
            // Actualizar la contraseña en la base de datos
            user.password = encryptedNewPassword;
            await user.save();
            // Responder al usuario con un mensaje de exito
            return res.send({ message: 'Password updated successfully' });
        }
        // Si el usuario no existe o la contraseña antigua no es válida, responder con un error
        return res.status(400).send({ message: 'Invalid username or old password' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating password' });
    }
}

*/

export const update = async (req, res) => { //Datos generales (No password)
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
        let updateUser = await User.findOneAndUpdate(
            { _id: id },  //ObjectsId <- hexadecimales (Hora sys, Version de mongo, Llave privada...)
            data,
            {new: true} //Objeto de la DB ya actualizado
        )
        //Validar la actualizacion
        if (!updateUser) return res.status(401).send({ message: 'User not found and not update' })
        //Respondo al usuario
        return res.send({ message: 'Update user', updateUser })
    } catch (err) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleteU = async(req, res)=>{
    try {
        //Obtener el Id
        let { id } = req.params
        //Validar si esta logeado y es el mismo X no lo haremos hoy X
        //Eliminar (deleteOne / findOneAndDelete)
        let deleteUser = await User.findOneAndDelete({_id: id})
        //Verificar que se elimino
        if(!deleteUser) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`}) //status: 200
    } catch (err) {
        console.error(err)
        console.error.status(500).send({message: 'Error deleting account'})
    }
}
import express from "express";

import { registerAnimal, getAnimals, deleteA, searchAnimal, updateA} from "./animal.controller.js";
import { update } from "../user/user.controller.js";

const api = express.Router();

api.post('/registerAnimal', registerAnimal)
api.get('/getAnimals', getAnimals)
api.delete('/deleteA/:id', deleteA)
api.get('/search/:id', searchAnimal)
api.put('/updateA/:id', updateA)

export default api
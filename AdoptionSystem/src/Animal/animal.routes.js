import express from "express";

import { registerAnimal } from "./animal.controller.js";

api.post('/registerAnimal', registerAnimal)

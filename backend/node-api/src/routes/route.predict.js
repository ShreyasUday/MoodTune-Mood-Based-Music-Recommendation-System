import express from "express"
import { recommend } from "../controller/controller.predict.js"

const route = express.Router()

route.post("/recommend", recommend)

export default route
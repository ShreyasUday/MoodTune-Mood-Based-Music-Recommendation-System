import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"
import predictRoute from "./routes/route.predict.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") })
const app = express()

app.use(express.json())
app.use(cors())

app.use("/predict/api", predictRoute)

export default app
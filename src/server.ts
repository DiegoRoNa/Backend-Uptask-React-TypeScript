import express from "express"
import cors from "cors"
import { corsConfig } from "./config/cors"
import colors from "colors"
import db from "./config/db"
import authRoutes from "./routes/authRoutes"
import projectRoutes from "./routes/projectRoutes"
import morgan from "morgan"

// Conectar a la BD
export async function connectDB() {
    try {
        db.authenticate() // verifica la conexion a la BD
        db.sync({ alter: true }) // mantiene acutlaizada la BD
        const url = `${db.config.host}:${db.config.port}`
        console.log(colors.blue.bold(`MySQL conectado en ${url}`))
    } catch (error) {
        console.log(colors.red.bold('MySQL no pudo conectarse'))
    }
}
connectDB()

const server = express() // servidor de noje y express

server.use(cors(corsConfig)) // endpoint de los cors

server.use(morgan('dev')) // mostrar endpoints ejecutados en consola

server.use(express.json()) // habilita el body en las peticiones

// Routes reales de la API
server.use('/api/auth', authRoutes)
server.use('/api/projects', projectRoutes)

export default server
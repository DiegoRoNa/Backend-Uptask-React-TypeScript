import { Sequelize } from "sequelize-typescript"
import dotenv from "dotenv" 
dotenv.config() // mandamos llamar toda la configuracion, funciones y métodos de dotenv

const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    timezone: '-06:00',
    // dialectOptions: {
    //     timezone: 'America/Mexico_City',
    // },
    models: [__dirname + '/../models/**/*'],
    logging: false
    // logging: console.log
})

export default db
import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = [process.env.FRONTEND_URL]

        // cachar desarrollo de api
        if (process.argv[2] === '--api') {
            whiteList.push(undefined) // el origin de postman, es undefined
        }
      
        if (whiteList.includes(origin)) {
        // if (origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
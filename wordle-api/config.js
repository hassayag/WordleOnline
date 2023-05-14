// loads the custom .env vars
import {config} from 'dotenv'
config()

export default {
    "sql": {
        "host": process.env.POSTGRES_HOST || "localhost",
        "database": "wordle-online",
        "port": process.env.POSTGRES_PORT || 5432,
        "user": process.env.POSTGRES_USER,
        "password": process.env.POSTGRES_PASS
    },
    "server": {
        "host": process.env.SERVER_HOST || "http://localhost",
        "port": process.env.SERVER_PORT || 8081
    },
    "client": {
        "host": process.env.CLIENT_HOST || "http://localhost",
        "port": process.env.CLIENT_PORT || 3000
    }
}

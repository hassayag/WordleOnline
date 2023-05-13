// loads the custom .env vars
import {config} from 'dotenv'
config()

export default {
    "sql": {
        "host": "localhost",
        "database": "wordle-online",
        "port": 5432,
        "user": process.env.POSTGRES_USER,
        "password": process.env.POSTGRES_PASS
    },
    "server": {
        "host": "http://localhost",
        "port": 8081
    },
    "client": {
        "host": "http://localhost",
        "port": 3000
    }
}

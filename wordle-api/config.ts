/* eslint-disable no-undef */
// loads the custom .env vars
import { config } from 'dotenv';

config();
const {POSTGRES_HOST: host, POSTGRES_DATABASE: database, POSTGRES_PORT: port, POSTGRES_USER: user, POSTGRES_PASS: password} = process.env

let sqlConfig;
if (process.env.ENVIRONMENT === 'development') {
    sqlConfig = {
        host: process.env.POSTGRES_HOST || 'localhost',
        database: process.env.POSTGRES_DATABASE || 'postgres',
        port: process.env.POSTGRES_PORT || 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASS,
    }
}
else {
    sqlConfig = {
        connectionString: `postgres://${user}:${password}@${host}:${port}/${database}?sslmode=require`
    }
}

export default {
    sql: sqlConfig,
    server: {
        host: process.env.SERVER_HOST || 'http://localhost:8080',
        port: process.env.SERVER_PORT || 8080,
    },
    client: {
        host: process.env.CLIENT_HOST || 'http://localhost:3000',
        port: process.env.CLIENT_PORT || 3000,
    },
    websocket: {
        port: 8081
    }
};

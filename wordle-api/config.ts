/* eslint-disable no-undef */
// loads the custom .env vars
import { config } from 'dotenv';

config();

export default {
    sql: {
        host: process.env.POSTGRES_HOST || 'localhost',
        database: process.env.POSTGRES_DATABASE || 'postgres',
        port: process.env.POSTGRES_PORT || 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASS,
        ssl: true
    },
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

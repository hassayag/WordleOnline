/* eslint-disable no-undef */
// loads the custom .env vars
import { config } from 'dotenv';

config();

export default {
    sql: {
        host: process.env.POSTGRES_HOST || 'localhost',
        database: 'wordle-online',
        port: parseInt(process.env.POSTGRES_PORT) || 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASS,
    },
    server: {
        host: process.env.SERVER_HOST || 'http://localhost:8080',
        port: parseInt(process.env.SERVER_PORT) || 8080,
    },
    websocket: {
        port: parseInt(process.env.WS_PORT) || 7071
    },
    client: {
        host: process.env.CLIENT_HOST || 'http://localhost:3000',
        port: parseInt(process.env.CLIENT_PORT) || 3000,
    },
};

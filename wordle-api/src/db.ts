import pg from 'pg';
import Config from '../config';

let client;

const db = () => {
    if (client) {
        return client;
    }

    client = new pg.Client(Config.sql);

    client.connect((err) => {
        if (err) {
            console.error('Error connecting to PostgreSQL', err.stack);
        } else {
            console.info('Connected to PostgreSQL');
        }
    });

    return client;
};

export default db;

import pg from 'pg';
import Config from '../../config.json' assert { type: "json" };
var client;

const psql = () => {
    if (client) {
        return client;
    }

    client = new pg.Client(Config.sql);

    client.connect((err) => {
        if (err) {
            console.error('Error connecting to PostgreSQL', err.stack)
        } else {
            console.log('Connected to PostgreSQL')
        }
    });

    return client
}

export default psql;
const { Client } = require('pg');
const Config = require('../config.json');
var client;

psql = () => {
    if (client) {
        return client;
    }

    client = new Client(Config.sql);

    client.connect((err) => {
        if (err) {
            console.error('Error connecting to PostgreSQL', err.stack)
        } else {
            console.log('Connected to PostgreSQL')
        }
    });

    return client
}

module.exports = psql;
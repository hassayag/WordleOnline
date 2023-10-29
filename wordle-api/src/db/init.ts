import fs from 'fs';
import path from 'path';
import psql from './db';

const create = async () => {
    const filePath = path.resolve('./data/create.sql');
    const createFile = fs.readFileSync(filePath).toString();
    console.info('Creating DB');
    try {
        await psql().query(createFile);
    } catch (err) {
        console.error(err);
    }
    console.info('Done');
};

create();

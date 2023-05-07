import fs from 'fs';
import path from 'path';
import psql from '../src/utils/sql.js';

const filePath = path.resolve('./db/create.sql');

const createFile = fs.readFileSync(filePath).toString();

const create = async () => {
    console.log('Creating DB')
    try {
        await psql().query(createFile);
    }
    catch (err) {
        console.log(err)
    }
    console.log('Done')
}

create()
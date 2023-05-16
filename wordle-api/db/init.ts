import fs from 'fs';
import path from 'path';
import psql from '../src/utils/sql';

const create = async () => {
    const filePath = path.resolve('./db/create.sql');    
    const createFile = fs.readFileSync(filePath).toString();
    console.log('Creating DB');
    try {
        await psql().query(createFile);
    } catch (err) {
        console.log(err);
    }
    console.log('Done');
};

create();

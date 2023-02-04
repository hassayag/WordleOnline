const fs = require('fs');
const psql = require('../utils/sql');

const createFile = fs.readFileSync('./create.sql').toString();

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
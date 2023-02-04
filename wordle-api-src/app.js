const Config = require('./config.json');
const cors = require('cors');
const express = require('express');
const game = require('./routes/game');
const session = require('./routes/session');
const words = require('./routes/words');

const initApp = () => {
    const app = express();
    app.use(cors())

    app.use('/game', game);
    app.use('/session', session);
    app.use('/words', words);

    app.listen(Config.server.port, () => {
    console.log(`Wordle API listening on port ${Config.server.port}`);
    })
}

initApp();
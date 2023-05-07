import cors from 'cors';
import express from 'express';

import Config from './config.json' assert { type: 'json' };
import game from './src/routes/game.js';
import session from './src/routes/session.js';
import words from './src/routes/words.js';

const initApp = () => {
    const app = express();
    app.use(cors());

    app.use('/game', game);
    app.use('/session', session);
    app.use('/words', words);

    app.listen(Config.server.port, () => {
        console.log(`Wordle API listening on port ${Config.server.port}`);
    });
};

initApp();

import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import Config from './config';
import game from './src/game/routes';
import session from './src/session/routes';
import words from './src/words/routes';
const initApp = () => {
    const app = express();
    app.use(cors({
        origin: Config.client.host + ':' + Config.client.port,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    }));
    app.use(cookieParser());
    app.use('/game', game);
    app.use('/session', session);
    app.use('/words', words);
    app.listen(Config.server.port, () => {
        console.log(`Wordle API listening on port ${Config.server.port}`);
    });
};
initApp();
//# sourceMappingURL=index.js.map
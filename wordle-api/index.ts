import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import Config from './config';
import game from './src/game/routes';
import session from './src/session/routes';
import words from './src/words/routes';

const initApp = () => {
    const app = express();

    
    app.use(
        cors({
            origin: Config.client.host + ':' + Config.client.port,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
        })
    );

    app.use(cookieParser());
    
    app.use('/game', game);
    app.use('/session', session);
    app.use('/words', words);
    
    // Define an error-handling middleware function
    app.use((err, req, res, next) => {
        console.log('ERROR MIDDELWARE')
        try {
            next()
        } catch (err) {
            console.error(err);
        
            // Set an appropriate HTTP status code based on the error
            if (err?.status) {
                res.status(err.status).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    })

    app.listen(Config.server.port, () => {
        console.log(`Wordle API listening on port ${Config.server.port}`);
    });
};

initApp();

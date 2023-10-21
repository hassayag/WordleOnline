import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import Config from './config';
import game from './src/game/routes';
import session from './src/session/routes';
import words from './src/words/routes';

const initApp = () => {
    const app = express();

    app.use((req: Request, res: Response, next: NextFunction) => {
        console.info(
            `${new Date().toISOString()} [api] Received request "${
                req.method
            } ${req.url}"`
        );
        next();
    });

    app.use(
        cors({
            origin: Config.client.host,
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
    app.use((err, req: Request, res: Response, next: NextFunction) => {
        console.error(
            `${new Date().toISOString()} [api] ${err?.message} - ${err?.stack}`
        );

        if (err?.statusCode) {
            res.status(err.statusCode).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    app.listen(Config.server.port, () => {
        console.log(`Wordle API listening on port ${Config.server.port}`);
    });
};

initApp();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import Config from '../../config';
import game from './game/routes';
import session from './session/routes';
import words from './words/routes';

export const initApp = () => {
    const app = express();

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
        console.info(`Wordle API listening on port ${Config.server.port}`);
        console.info(`CORS will only accept requests from ${Config.client.host}`);
    });
}

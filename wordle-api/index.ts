import cookieParser from 'cookie-parser';
import cors from 'cors';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import Config from './config';
import game from './src/game/routes';
import session from './src/session/routes';
import words from './src/words/routes';

const initApp = () => {
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
        console.log(`Wordle API listening on port ${Config.server.port}`);
    });
};

const initWsServer = () => {
    const wss = new WebSocket.Server({ port: Config.websocket.port });
    const clients = new Map();
    wss.on('connection', (ws) => {
        const id = uuidv4();
        const color = Math.floor(Math.random() * 360);
        const metadata = { id, color };
    
        clients.set(ws, metadata);
    })
    console.log(`Websocket Server listening on port ${Config.websocket.port}`)
}

initApp();
initWsServer();

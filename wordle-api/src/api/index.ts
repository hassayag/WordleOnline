import cookieParser from 'cookie-parser';
import fs from 'fs'
import https from 'https'
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
            maxAge: 86400
        })
    );
    app.use(cookieParser());

    app.use((req: Request, res: Response, next: NextFunction) => {
        console.info(`${new Date().toISOString()} [api] Received request: ${req.method} ${req.url}`)
        next()
    })

    app.use('/game', game);
    app.use('/session', session);
    app.use('/words', words);

    // Define an error-handling middleware function
    app.use((err, req: Request, res: Response, next: NextFunction) => {
        if (err?.statusCode) {
            if (err.statusCode >= 500) {
                console.error(
                    `${new Date().toISOString()} [api] ${err?.message} - ${err?.stack}`
                );        
            }
            else {
                console.info(
                    `${new Date().toISOString()} [api] ${err?.message}`
                );        
            }
            res.status(err.statusCode).json({ message: err.message });
        } else {
            console.error(
                `${new Date().toISOString()} [api] ${err?.message} - ${err?.stack}`
            );    
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    // Create an HTTPS server with a self-signed certificate
    const options = {
        key: fs.readFileSync('./local/ssl/key.pem'),     // Path to your private key file
        cert: fs.readFileSync('./local/ssl/cert.pem'),    // Path to your certificate file
    };
    
    const server = https.createServer(options, app);
    
    server.listen(Config.server.port, () => {
        console.info(`Wordle API listening on port ${Config.server.port}`);
        console.info(`CORS will only accept requests from ${Config.client.host}`);
    });
}

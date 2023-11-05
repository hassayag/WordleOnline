import fs from 'fs';
import https from 'https';
import Config from './config';
import { initApp } from './src/api';
import { initWsServer } from './src/socket';

try {
    const app = initApp();
    // Create an HTTPS server with a self-signed certificate
    const options = {
        key: fs.readFileSync('./local/ssl/key.pem'), // Path to your private key file
        cert: fs.readFileSync('./local/ssl/cert.pem'), // Path to your certificate file
    };

    const server = https.createServer(options, app);

    initWsServer(server);

    server.listen(Config.server.port, () => {
        console.info(`Wordle API listening on port ${Config.server.port}`);
        console.info(
            `CORS will only accept requests from ${Config.client.host}`
        );
    });
} catch (err) {
    console.error(`Error occurred during server startup - ${err}`);
}

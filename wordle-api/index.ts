import { initApp } from "./src/api";
import {initWsServer} from './src/socket'

try {
    initApp();
    initWsServer();
}
catch (err) {
    console.error(`Error occurred during server startup - ${err}`)
}

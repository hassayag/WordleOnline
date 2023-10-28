import WebSocket from 'ws';
import Config from '../../config'

export const initWsServer = () => {
    const wss = new WebSocket.Server({ port: Config.websocket.port });

    // map of session token and their respective socket
    const clients = new Map<string, WebSocket>();

    wss.on('connection', (socket, request) => {
        // cookie looks like "session=abcd-1234-efgh-5678"
        const sessionToken = request.headers.cookie.replace('session=', '')
        clients.set(sessionToken, socket)
        
        socket.on("message", data => {
            socket.send(`I got your message :) - ${data}`)
        });

        socket.on("close", () => {
            clients.delete(sessionToken)

        });
        
    })

    console.info(`Websocket Server listening on port ${Config.websocket.port}`)
}
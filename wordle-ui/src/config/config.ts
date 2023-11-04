const host = process.env.REACT_APP_API_HOST || 'https://localhost:8080';
const port = process.env.REACT_APP_API_PORT || '8080';

const config = {
    api: {
        host,
        port,
    },
    feature_flags: {
        synth: process.env.REACT_APP_FEATURE_FLAG_SYNTH || false,
    },
    socketUrl: process.env.REACT_APP_SOCKET_HOST || 'ws://localhost:8081'
};

export default config;

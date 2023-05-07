
const host = process.env.API_HOST || 'http://localhost';
const port = process.env.API_PORT || '8081';

const config = {
    api: {
        host,
        port,
        url: host + port
    }
}

export default config;

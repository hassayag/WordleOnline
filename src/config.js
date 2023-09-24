'use client'

const host = process.env.REACT_APP_API_HOST || 'http://localhost';
const port = process.env.REACT_APP_API_PORT || '8081';

const config = {
    api: {
        host,
        port,
        url: `${host}:${port}`,
    },
};

export default config;

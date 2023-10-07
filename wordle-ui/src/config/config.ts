const host = process.env.REACT_APP_API_HOST || 'http://localhost';
const port = process.env.REACT_APP_API_PORT || '8081';

const config = {
    api: {
        host,
        port,
        url: `${host}:${port}`,
    },
    feature_flags: {
        synth: process.env.FEATURE_FLAG_SYNTH || false
    }
};

export default config;

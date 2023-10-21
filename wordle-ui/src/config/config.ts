const host = process.env.REACT_APP_API_HOST || 'http://localhost:8080';
const port = process.env.REACT_APP_API_PORT || '8080';

const config = {
    api: {
        host,
        port,
    },
    feature_flags: {
        synth: process.env.FEATURE_FLAG_SYNTH || false,
    },
};

export default config;

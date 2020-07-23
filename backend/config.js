import './load-env.js';

const environment = {
    ...process.env,
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || 'production'
};

module.exports = environment;
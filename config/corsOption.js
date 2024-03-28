const corsOptions = [
    {
        origin: 'https://royalbusinesses.net',
        credentials: true,
        optionSuccessStatus: 200
    },
    {
        origin: 'https://shop-64682.web.app',
        credentials: true,
        optionSuccessStatus: 200
    },
    {
        origin: 'http://localhost:3000',
        credentials: true,
        optionSuccessStatus: 200
    },
];

module.exports = corsOptions;

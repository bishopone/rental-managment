const corsOptions = [
    {
        origin: 'https://www.royalbusinesses.net',
        methods: 'GET,POST,PATCH,DELETE,OPTIONS',
        credentials: true,
        optionSuccessStatus: 200
    },
    {
        origin: 'https://shop-64682.web.app',
        methods: 'GET,POST,PATCH,DELETE,OPTIONS',
        credentials: true,
        optionSuccessStatus: 200
    },
    {
        origin: 'http://localhost:3000',
        methods: 'GET,POST,PATCH,DELETE,OPTIONS',
        credentials: true,
        optionSuccessStatus: 200
    },
];

module.exports = corsOptions;

//host que pueden realizar peticiones
const ALLOWED_ORIGINS = [
    /http:\/\/localhost:([0-9]{4})/,
];

//access-control-allow:
const OPTIONS = {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "case",
        "user_id",
        "trip_id",
        "destination"
    ],
};

module.exports = { OPTIONS };
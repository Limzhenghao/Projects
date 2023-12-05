const mongodbStore = require('connect-mongodb-session');

// Creates sessions and stores them in database

function createSessionStore(session) {
    const MongoDBStore = mongodbStore(session);

    const sessionStore = new MongoDBStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });

    return sessionStore;
};

function createSessionConfig(sessionStore) {
    return {
        secret: 'super-secret',

        // Does not save session back into session store if data unmodified
        resave: false,

        // Does not store new session into session store
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000,
        }
    };
};

module.exports = {
    createSessionStore: createSessionStore,
    createSessionConfig: createSessionConfig
};
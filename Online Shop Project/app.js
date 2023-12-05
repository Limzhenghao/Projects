const path = require('path');

const express = require('express');
const session = require('express-session');

const handleErrors = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');

const db = require('./data/database');

const sessionConfig = require('./config/session');

const authRoutes = require('./routes/auth-routes');
const baseRoutes = require('./routes/base-routes');
const productRoutes = require('./routes/product-routes');
const adminRoutes = require('./routes/admin-routes');
const customerRoutes = require('./routes/customer-routes');

const csrf = require('@dr.pogodin/csurf')
const addCSRFTokenMiddleware = require('./middlewares/csrf-token-middleware');

const mongoDbSessionStore = sessionConfig.createSessionStore(session);

const app = express();

// Set EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Enable session storage and usage
app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));

// 'csrf' middleware generates and validates CSRF tokens
// 'addCSRFTokenMiddleware adds CSRF token to res.locals so it can be used globally
app.use(csrf());
app.use(addCSRFTokenMiddleware.addCSRFToken);

// Checks if user is authenticated and an admin
app.use(checkAuthStatusMiddleware.checkAuthStatus);

// Parse JSON data in incoming requests
app.use(express.json());

// Serve public static files
app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));

app.use(authRoutes);
app.use(baseRoutes);
app.use(productRoutes);
app.use(customerRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use(handleErrors.handleServerErrors);

// Connects to database first then displays website at port 3000
// Catches errors if failed to connect to database
db.connectToDatabase()
    .then(function() {
        app.listen(3000);
    })
    .catch(function (error) {
        console.log('Failed to connect to the database!');
        console.log(error);
    });
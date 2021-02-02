// ------------------------------------------
// Module dependencies
// ------------------------------------------
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as lusca from 'lusca';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { mainApplicationRouter } from './router';
import { createMongoConnection } from './config/dbConnection';
dotenv.config();
// ------------------------------------------
// Express server configuration
// ------------------------------------------
const app = express();

const port = process.env.PORT || 5000;
app.set('port', port);

// created mongodb connection
createMongoConnection(process.env.DB_URL);

/**
 * Compression is a middleware that will attempt to compress response bodies for all the request.
 */
app.use(compression());

// allowed cors
app.use(cors());

/**
 * Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
 * bodyParser.json() is a middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
 */
app.use(bodyParser.json());
/**
 * bodyParser.urlencoded() is a middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option.
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * lusca - Web application security middleware.
 * lusca.xframe - Enables X-FRAME-OPTIONS headers to help prevent Clickjacking.
 */
app.use(lusca.xframe('SAMEORIGIN'));
/**
 * lusca.xssProtection - Enables X-XSS-Protection headers to help prevent cross site scripting (XSS) attacks in older IE browsers (IE8).
 */
app.use(lusca.xssProtection(true));

// ------------------------------------------
// Security Checks
// ------------------------------------------
/**
 * helmet - Helmet helps you secure your Express apps by setting various HTTP headers.
 */
app.use(helmet());

/**
 * hsts - for HTTP Strict Transport Security.
 */
app.use(
    helmet.hsts({
        maxAge: Number(process.env.STRICT_TRANSPORT_SECURITY), // 365 days in seconds
        includeSubDomains: true, // Must be enabled to be approved by Google
    })
);
/**
 * add security related header in all request.
 */
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "style-src 'unsafe-inline' 'self' 'unsafe-eval';");
    res.setHeader('X-Content-Security-Policy', "style-src 'unsafe-inline' 'self' 'unsafe-eval';");
    next();
});

// ------------------------------------------
// Express server
// ------------------------------------------

/**
 * Default route to check server health
 */
app.get('/', (req, res) => {
    res.send(`Express server is running at port ${app.get('port')}`);
});

/**
 * Main api route to manage operations
 */
app.use('/api', mainApplicationRouter);

export default app;

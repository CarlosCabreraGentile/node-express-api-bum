const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { port, nodeEnv } = require('./config/config') // with .env file
const PORT = port || 5000;
const DBConnection = require('./config/dbConnection');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error'); 
const fileupload = require('express-fileupload');
//const logger = require('./middleware/logger'); //example logger middleware

//Load env
dotenv.config({ path: './config/config.env' });
const morgan = require('morgan');

//Database connection
DBConnection();

// Middlewares

// CORS
app.use(cors());

/**
 * Converts the JSON format code that comes from the browser
 * and the server can handle 
 * Body Parser
 */
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev loggin middleware
if (nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Prevent XSS attack cross site scripting
app.use(xss());

// Rate limiting, control number of request to API for 10 minutes
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
});
app.use(limiter);

// Prevent htpp param pollution
app.use(hpp());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routers
const bootcampsRouter = require('./routes/bootcamps');
const coursesRouter = require('./routes/courses');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const reviewsRouter = require('./routes/reviews');

//Mount Routes
app.use('/api/v1/bootcamps', bootcampsRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

// Middlewares after routes
// custom middleware
// app.use(logger);
app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log(`App running in ${process.env.NODE_ENV} on port ${PORT}!`.yellow.bold);
    // console.log(`App running in ${nodeEnv} on port ${PORT}!`.yellow.bold); // with .env file 
});

// Hanlde unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close server & exit process
    server.close(() => process.exit(1));
});
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { port, nodeEnv } = require('./config/config') // with .env file
const PORT = port || 5000;
const DBConnection = require('./config/dbConnection');
const colors = require('colors');
const errorHandler = require('./middleware/error'); 
//const logger = require('./middleware/logger'); //example logger middleware

//Load env
dotenv.config({ path: './config/config.env' });
const morgan = require('morgan');

//Database connection
DBConnection();

//CORS Middleware
app.use(cors());

//Middleware
/**
 * Converts the JSON format code that comes from the browser
 * and the server can handle 
 * Body Parser
 */
app.use(express.json());

//Routers
const bootcampsRouter = require('./routes/bootcamps');

//Mount Routes
app.use('/api/v1/bootcamps', bootcampsRouter);

//Middlewares after routes
//custom middleware
// app.use(logger);
app.use(errorHandler);

//Dev loggind middleware
if (nodeEnv === 'development') {
    app.use(morgan('dev'));
}

const server = app.listen(PORT, () => {
    console.log(`App running in ${process.env.NODE_ENV} on port ${PORT}!`.yellow.bold);
    // console.log(`App running in ${nodeEnv} on port ${PORT}!`.yellow.bold); // with .env file 
});

//Hanlde unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close server & exit process
    server.close(() => process.exit(1));
});
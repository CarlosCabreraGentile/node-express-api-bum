const express = require('express');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const logger = require('./middleware/logger'); //example logger middleware
const morgan = require('morgan');

//Route files
const bootcampsRouter = require('./routes/bootcamps');

//Load env 
dotenv.config({ path: './config/config.env' });

const app = express();

//custom middleware
// app.use(logger);

//Dev loggind middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Mount Routes
app.use('/api/v1/bootcamps', bootcampsRouter);


app.listen(PORT, () => {
    console.log(`App running in ${process.env.NODE_ENV} on port ${PORT}!`);
});
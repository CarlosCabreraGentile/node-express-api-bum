const ErrorResponse = require("../utils/errorResponse");

// Because it is a middleware, we need to run it with app.use in server.js
const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    // Log to console for dev
    console.log(err);

    //Mongoose error ObjectId
    if(err.name === 'CastError'){
        const message = `Resource not found with id: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate key
    if(err.code === 11000){
        const message = `Duplicate field: ${err.keyValue.name}`;
        error = new ErrorResponse(message, 400);
    }
    //Mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false, 
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;
/**
 * 
 * @description Logs request to console 
 */

//middleware a function that access to the req res cycle during and runs during that cycle 
//must call next to move on  
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}//${req.get('host')}${req.originalUrl}`);
    next();
}

module.exports = logger;
const mongoose = require('mongoose');
const connection = require('./db');
// const { mongodbURI } = require('./config'); // with .env file
// const dotenv = require('dotenv'); // uncomment if no .env file

// Load env variables
// dotenv.config({ path: './config.env' }); // uncomment if no .env file

const DBConnection = () => {
    // OPTION 1
    mongoose.connect(connection.database,
    // OPTION 2
    // mongoose.connect(process.env.MONGO_URI, // uncomment if no .env file
    // OPTION 3
    // mongoose.connect(mongodbURI,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
        .then(() => console.log('DB Connected!'.cyan.underline.bold))
        .catch(err => {
            console.log(`DB Connection Error: ${err.message}`.red.underline.bold);
        });
}
module.exports = DBConnection;
const mongoose = require('mongoose');
const connection = require('./db');

const DBConnection = () => {
    // OPTION 1
    mongoose.connect(connection.database,
    // OPTION 2
    // mongoose.connect(process.env.MONGO_URI,
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
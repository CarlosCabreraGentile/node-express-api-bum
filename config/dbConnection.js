const mongoose = require('mongoose');
const connection = require('./db');

const DBConnection = () => {
    mongoose.connect(connection.database,
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
const fs = require('fs');
const mongoose = require('mongoose');
const connection = require('./config/db');
const colors = require('colors');
const { mongodbURI } = require('./config/config');
const Bootcamp = require('./models/Bootcamp');
// const dotenv = require('dotenv'); // uncomment if no .env file

// Load env variables
// dotenv.config({ path: './config/config.env' }); // uncomment if no .env file

// Connect to DB
// OPTION 1
// mongoose.connect(connection.database, {
// OPTION 2
// mongoose.connect(process.env.MONGO_URI, { // uncomment if no .env file
// OPTION 3
mongoose.connect(mongodbURI, {    
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import into DB
const importData = async () =>{
    try {
        await Bootcamp.create(bootcamps);
        console.log('DATA IMPORTED'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete data
const deleteData = async () =>{
    try {
        await Bootcamp.deleteMany();
        console.log('DATA DELETED'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i'){ // node seeder -i --> this is the argv[2]
    importData();
} else if(process.argv[2] === '-d'){ // node seeder -d --> this is the argv[2]
    deleteData();
}
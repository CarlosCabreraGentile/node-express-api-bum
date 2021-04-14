// const dotenv = require("dotenv"); // uncomment if no .env file
// Load env variables
// dotenv.config({ path: "./config/config.env" }); // uncomment if no .env file
const NodeGeocoder = require('node-geocoder');
const { geocoderProvider, geocoderApiKey } = require('../config/config');

const options = {
    // provider: process.env.GEOCODER_PROVIDER, //uncomment if no .env file
    provider: geocoderProvider,
    httpAdapter: 'https',
    // apiKey: process.env.GEOCODER_API_KEY, //uncomment if no .env file
    apiKey: geocoderApiKey,
    formatter: null
}

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
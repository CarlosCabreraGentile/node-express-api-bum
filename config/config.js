const dotenv = require('dotenv');
 // Load env variables
dotenv.config();
 
module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodbURI: process.env.MONGO_URI,
  geocoderProvider: process.env.GEOCODER_PROVIDER,
  geocoderApiKey: process.env.GEOCODER_API_KEY,
  maxFileUpload: process.env.MAX_FILE_UPLOAD,
  fileUploadPath: process.env.FILE_UPLOAD_PATH
};

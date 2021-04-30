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
  fileUploadPath: process.env.FILE_UPLOAD_PATH,
  secret: process.env.JWT_SECRET,
  expire: process.env.JWT_EXPIRE,
  expireCookie: process.env.JWT_COOKIE_EXPIRE,
  SMTPHost: process.env.SMTP_HOST,
  SMTPPort: process.env.SMTP_PORT,
  SMTPEmail: process.env.SMTP_EMAIL,
  SMTPPassword: process.env.SMTP_PASSWORD,
  fromEmail: process.env.FROM_EMAIL,
  fromName: process.env.FROM_NAME
};

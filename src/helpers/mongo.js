const mongoose = require('mongoose')

const { uri: mongoUri } = require('../configs/mongo.config.js')
const logger = require('./logger.js')

const connectMongoDB = async () => {
  mongoose.connect(mongoUri, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
  }, err => {
      if(err) {
          logger.error(err.message)
          throw err;
      }
      logger.info(`Connect to database !`)
  })
}

module.exports = { connectMongoDB }
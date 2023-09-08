const mongoose = require('mongoose')

const { uri: mongoUri } = require('../configs/mongo.config.js')
const { logger } = require('./logger.js')

const mongoOptions = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectMongoDB = async () => {
  mongoose.connect(mongoUri, mongoOptions, err => {
      if(err) {
          logger.error(err.message)
          throw err
      }
      logger.info(`Mongo database connected!`)
  })
}

module.exports = { connectMongoDB }
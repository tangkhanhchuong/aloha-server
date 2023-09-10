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
		if (err) {
			logger.error(JSON.stringify({
				msg: err.message,
				status: err.status
			}))
			throw err
		}
		logger.info(JSON.stringify({
			msg: `Mongo database connected!`
		}))
	})
}

module.exports = { connectMongoDB }
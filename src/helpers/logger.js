const winston = require('winston')

const logLevels = {
	error: 1,
	warn: 2,
	info: 3,
	debug: 4,
}

const syslogColors = {
	debug: 'rainbow',
	info: 'cyan',
	notice: 'white',
	warning: 'yellow',
	error: 'bold red'
}

const logger = winston.createLogger({
	levels: logLevels,
	transports: [
		new winston.transports.Console({
			level: process.env.LOG_LEVEL ?? 'debug',
			format: winston.format.combine(
				winston.format.colorize({
					all: true,
					colors: syslogColors,
				}),
				winston.format.simple()
			)
		})
	]
})

module.exports = { logger }
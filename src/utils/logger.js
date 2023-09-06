const { createLogger, format, transports } = require("winston")

const logLevels = {
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const logger = createLogger({
  levels: logLevels,
  transports: [new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.align(),
      format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
    )
  })],
})

module.exports = logger
const host = process.env.MONGO_HOST
const port = process.env.MONGO_PORT
const database = process.env.MONGO_DATABASE

const mongoConfig = {
  host,
  port,
  database,
  uri: `mongodb://${host}:${port}/${database}`
}

module.exports = mongoConfig
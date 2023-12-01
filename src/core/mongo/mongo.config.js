const {
  MONGO_HOST: host,
  MONGO_PORT: port,
  MONGO_DATABASE: database,
} = process.env;

const uri = `mongodb://${host}:${port}/${database}`;

const mongoConfig = {
  host,
  port,
  database,
  uri,
};

module.exports = mongoConfig;

const PORT = process.env.PORT || 7080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';
const MONGO_DB = process.env.MONGO_DB || 'ryd-coding-challenge-db';

export {
  PORT,
  MONGO_DB,
  MONGO_URI,
};

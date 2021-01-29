import { MongoMemoryServer } from 'mongodb-memory-server';

const createTestMongoServer = (): MongoMemoryServer => {
  return new MongoMemoryServer({
    instance: {
      ip: '::,0.0.0.0',
      port: 65395,
    },
  });
};

export {
  createTestMongoServer,
};

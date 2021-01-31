import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import { ExpressServer } from '../../src/server/express-server';
import { createTestMongoServer } from '../helpers/mongo-helper';
let expressServer: ExpressServer;
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = createTestMongoServer();
  await mongod.start();
  expressServer = new ExpressServer();
});
afterAll(async () => {
  expressServer.close();
  await mongod.stop();
});
describe('Should be able to access ExpressServer on endpoint /health-check', () => {
  it('should have /readiness endpoint and return 200 with status OK', async () => {
    const res = await supertest(expressServer.getServer())
      .get('/health-check/readiness');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('OK');
  });
});

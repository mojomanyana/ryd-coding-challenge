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
  expressServer.listen();
});
afterAll(async () => {
  await expressServer.close();
  await mongod.stop();
});
describe('Should be able to access ExpressServer on endpoint /agent', () => {
  it('should execute POST /agent endpoint and return 201 with status DTO', async () => {
    const res = await supertest(expressServer.getServer())
      .post('/agent')
      .send({
        username: 'TestUsername',
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('username');
    expect(res.body.username).toEqual('TestUsername');
  });

  it('should execute POST /agent endpoint and return 500 for invalid input', async () => {
    const res = await supertest(expressServer.getServer())
      .post('/agent')
      .send({
        username: '',
      });
    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });

  it('should execute GET /agent endpoint and return 200 with status DTO', async () => {
    const res = await supertest(expressServer.getServer())
      .get('/agent');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('agents');
    expect(res.body.agents.length).toEqual(1);
  });

  it('should execute GET /agent endpoint and return 500 for invalid qs', async () => {
    const res = await supertest(expressServer.getServer())
      .get('/agent?page=-100');
    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });
});

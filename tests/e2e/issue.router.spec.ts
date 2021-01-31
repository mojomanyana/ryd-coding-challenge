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
describe('Should be able to access ExpressServer on endpoint /issue', () => {
  it('should execute POST /issue endpoint and return 201 with status DTO', async () => {
    const res = await supertest(expressServer.getServer())
      .post('/issue')
      .send({
        title: 'Test',
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('title');
    expect(res.body.title).toEqual('Test');
  });

  it('should execute POST /issue endpoint and return 500 for invalid input', async () => {
    const res = await supertest(expressServer.getServer())
      .post('/issue')
      .send({
        title: '',
      });
    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });

  it('should execute GET /issue endpoint and return 200 with status DTO', async () => {
    const res = await supertest(expressServer.getServer())
      .get('/issue');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('issues');
    expect(res.body.issues.length).toEqual(1);
  });

  it('should execute GET /issue endpoint and return 500 for invalid qs', async () => {
    const res = await supertest(expressServer.getServer())
      .get('/issue?page=-100');
    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });
});

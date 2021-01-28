import supertest from 'supertest';
import { ExpressServer } from '../../src/server/express-server';
let expressServer: ExpressServer;

describe('Should be able to access ExpressServer on endpoint /health-check', () => {
  beforeAll(async () => {
    expressServer = new ExpressServer();
  });
  afterAll(() => {
    expressServer.close();
  });
  it('should have /readiness endpoint and return 200 with status OK', async () => {
    const res = await supertest(expressServer.getServer())
      .get('/health-check/readiness');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('OK');
  });
});

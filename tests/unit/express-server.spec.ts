import mongoose from 'mongoose';
import sinon from 'sinon';
import { ExpressServer } from '../../src/server/express-server';

beforeEach(() => {
  sinon.stub(mongoose, 'connect');
  sinon.stub(mongoose.connection, 'close');
});
afterEach(() => {
  (mongoose.connect as sinon.SinonStub).restore();
  (mongoose.connection.close as sinon.SinonStub).restore();
});
describe('ExpressServer unit testing', () => {
  it('Should success afre instaciating ExpressServer', async () => {
    (mongoose.connect as sinon.SinonStub).resolves(Promise.resolve());
    const expressServer = new ExpressServer();
    expect(expressServer).toBeDefined();
    expect(expressServer.getApp()).toBeDefined();
    expect(expressServer.getServer()).toBeDefined();
  });
});

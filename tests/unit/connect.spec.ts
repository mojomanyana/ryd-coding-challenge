import mongoose from 'mongoose';
import sinon from 'sinon';
import { connectToMongo, disconnectFromMongo } from '../../src/server/connect';

describe('Connect and Disconnect from mongo unit testing', () => {
  beforeEach(() => {
    sinon.stub(mongoose, 'connect');
    sinon.stub(mongoose.connection, 'close');
  });
  afterEach(() => {
    (mongoose.connect as sinon.SinonStub).restore();
    (mongoose.connection.close as sinon.SinonStub).restore();
  });
  it('Should success after successful connection to mongo', async () => {
    (mongoose.connect as sinon.SinonStub).resolves(Promise.resolve());
    await connectToMongo('mongostringvalid');
  });
  it('Should fail after unsuccessful connection to mongo', async () => {
    (mongoose.connect as sinon.SinonStub).throws('Invalid DB string');
    try {
      await connectToMongo('mongostringinvalid');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it('Should success after successful disconnection from mongo', async () => {
    (mongoose.connection.close as sinon.SinonStub).resolves(Promise.resolve());
    await disconnectFromMongo();
  });
  it('Should fail after again trying disconnect from mongo', async () => {
    (mongoose.connection.close as sinon.SinonStub).throws('Connection already broken');
    try {
      await disconnectFromMongo();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});

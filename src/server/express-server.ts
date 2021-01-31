import express, { Application } from 'express';
import http from 'http';

import * as config from '../config';
import agentRouter from '../routes/agent.router';
import healthCheckRouter from '../routes/health-check.router';
import issueRouter from '../routes/issue.router';
import { connectToMongo, disconnectFromMongo } from './connect';

class ExpressServer {
  private app: Application;
  private server: http.Server;

  constructor() {
    this.initApp();
    this.initServer();
    this.listen();
  }

  public getApp(): Application {
    return this.app;
  }

  public getServer(): http.Server {
    return this.server;
  }

  public close() {
    disconnectFromMongo();
    this.server.close();
  }

  public initApp() {
    this.app = express();
    this.app.use(express.json());
    this.app.use('/health-check', healthCheckRouter);
    this.app.use('/issue', issueRouter);
    this.app.use('/agent', agentRouter);
  }

  public initServer() {
    this.server = http.createServer(this.app);
  }

  public listen() {
    this.server.listen(config.PORT, () => {
      connectToMongo(config.MONGO_URI, config.MONGO_DB);
    });
  }
}

export {
  ExpressServer,
};

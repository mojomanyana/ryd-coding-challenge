import { ExpressServer } from './server/express-server';

const server = new ExpressServer();

process.on('SIGTERM', () => {
  server.close();
  process.exit(0);
});

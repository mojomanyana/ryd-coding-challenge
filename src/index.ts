import { ExpressServer } from './server/express-server';

const server = new ExpressServer();
server.listen();

process.on('SIGTERM', async () => {
  await server.close();
  process.exit(0);
});

import { config } from 'dotenv';
config();
import createServer from './Infrastructures/http/createServer';
import container from './Infrastructures/container';

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();

import App from './App';
import initSocket from './socket/socket';

const app = new App();

const runApp = async () => {
  const httpServer = await app.start();
  initSocket(httpServer);

  // eslint-disable-next-line no-console
  console.log(`Running on port ${app.port}`);
};

runApp();

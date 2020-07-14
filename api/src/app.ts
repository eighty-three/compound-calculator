import config from './utils/config';
import express from 'express';
import cors from 'cors';
const app = express();

//Middleware
import middleware from './utils/middleware';
import logger from './utils/logger';
logger.info('connecting to', config.DB_CONNECTION);

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

//Routes
import router from './controllers';
app.use('/api/rates', router);

//Error handler
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

//Cron Job
import cron from 'node-cron';
import { updateRates } from './controllers/currencies';

if (config.NODE_ENV === 'production') {
  const task = cron.schedule('* */6 * * *', () => {
    console.log('Starting cron...');
    updateRates(); 
  });

  updateRates();
  task.start();
}

export default app;

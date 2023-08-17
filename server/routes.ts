import { Application } from 'express';
import examplesRouter from './api/routes/router';
export default function routes(app: Application): void {
  app.use('/api/v1/examples', examplesRouter);
}
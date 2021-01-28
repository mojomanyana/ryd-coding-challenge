import express, { Request, Response } from 'express';

const healthCheckRouter = express.Router();

healthCheckRouter.get('/readiness', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
  });
});

export default healthCheckRouter;

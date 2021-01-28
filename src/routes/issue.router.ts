import express, { Request, Response } from 'express';
import issueService from '../services/issue.service';

const issueRouter = express.Router();

issueRouter.post('/', async (req: Request, res: Response) => {
  try {
    await issueService.createNewIssue(req.body.title);
    res.status(201).json({
      status: 'created',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default issueRouter;

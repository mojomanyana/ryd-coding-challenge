import express, { Request, Response } from 'express';
import issueService from '../services/issue.service';

const issueRouter = express.Router();

issueRouter.post('/', async (req: Request, res: Response) => {
  try {
    const retVal = await issueService.createNewIssue({...req.body});
    res.status(201).json(retVal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

issueRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
    const size = req.query.size ? parseInt(req.query.size as string, 10) : 20;
    const retVal = await issueService.listAllIssue(page, size);
    res.json(retVal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default issueRouter;

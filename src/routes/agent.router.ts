import express, { Request, Response } from 'express';
import agentService from '../services/agent.service';

const agentRouter = express.Router();

agentRouter.post('/', async (req: Request, res: Response) => {
  try {
    const retVal = await agentService.createNewAgent({...req.body});
    res.status(201).json(retVal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

agentRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
    const size = req.query.size ? parseInt(req.query.size as string, 10) : 20;
    const retVal = await agentService.listAllAgents(page, size);
    res.json(retVal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default agentRouter;

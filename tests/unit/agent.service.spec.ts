import { Agent, AgentRepository } from '../../src/models/agent.model';
import { AgentStatusType } from '../../src/models/enums';
import agentService from '../../src/services/agent.service';

const validAgent: any = { username: 'TestUsername' };

describe('Agent service unit testing', () => {
  it('Should create agent succesfuly', async () => {
    const spy = jest.spyOn(AgentRepository, 'create')
      .mockReturnValueOnce(
        Promise.resolve(validAgent),
      );
    await agentService.createNewAgent(validAgent);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
  });

  it('Should rethrow error for missing username upon creating new agent', async () => {
    const spy = jest.spyOn(AgentRepository, 'create')
      .mockReturnValueOnce(
        Promise.resolve(validAgent),
      );
    try {
      await agentService.createNewAgent({ username: '' });
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('username for the agent must be provided');
      expect(spy).toHaveBeenCalledTimes(0);
    } finally {
      spy.mockReset();
    }
  });

  it('Should rethrow error if AgentRepository.create fails upon creating new agent', async () => {
    const spy = jest.spyOn(AgentRepository, 'create').mockReturnValueOnce('Error' as any);
    try {
      await agentService.createNewAgent(validAgent);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toEqual('Error');
    } finally {
      spy.mockReset();
    }
  });

  it('Should return filtered list of agents', async () => {
    AgentRepository.find =
      jest.fn().mockImplementationOnce(() =>
        ({ skip: jest.fn().mockImplementationOnce(() =>
          ({ limit: jest.fn().mockImplementationOnce(() =>
            ({ exec: jest.fn().mockReturnValueOnce(Promise.resolve([Agent.createInstance(validAgent)])) }),
          )}),
        )}),
      );
    AgentRepository.countDocuments =
      jest.fn().mockImplementationOnce(() =>
        ({ exec: jest.fn().mockReturnValueOnce(Promise.resolve(1)) }),
      );
    const retVal = await agentService.listAllAgents(0, 20, AgentStatusType.Working);
    expect(retVal).toBeDefined();
    expect(retVal.size).toEqual(20);
    expect(retVal.total).toEqual(1);
    expect(retVal.page).toEqual(0);
    expect(retVal.agents.length).toEqual(1);
    expect(retVal.agents[0].username).toEqual('TestUsername');
  });

  it('Should rethrow error for negativ page upon return list of agents', async () => {
    try {
      await agentService.listAllAgents(-1);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('page can only be number bigger or equal to 0');
    }
  });

  it('Should rethrow error for negativ size upon return list of Agent', async () => {
    try {
      await agentService.listAllAgents(0, -1);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('size can only be number bigger than 0 and less then 50');
    }
  });
});

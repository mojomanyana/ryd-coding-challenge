import { Agent, AgentRepository } from '../../src/models/agent.model';
import { IssueStatusType } from '../../src/models/enums';
import { Issue, IssueRepository } from '../../src/models/issue.model';
import issueService from '../../src/services/issue.service';

const validIssue: any = { title: 'Test' };
const validAgent: any = { username: 'TestUsername' };
AgentRepository.find =
  jest.fn().mockImplementation(() =>
    ({ limit: jest.fn().mockImplementation(() =>
      ({ exec: jest.fn().mockReturnValue(Promise.resolve([Agent.createInstance(validAgent, validIssue)])) }),
    )}),
  );

describe('Issue service unit testing', () => {
  it('Should create issue succesfuly', async () => {
    const spy1 = jest.spyOn(IssueRepository, 'create')
      .mockReturnValueOnce(
        Promise.resolve(Issue.createInstance(validIssue, validAgent) as any),
      );
    const spy2 = jest.spyOn(AgentRepository, 'findByIdAndUpdate')
      .mockReturnValueOnce(
        validAgent as any,
      );
    const retDto = await issueService.createNewIssue(validIssue);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(retDto).toBeDefined();
    spy1.mockReset();
    spy2.mockReset();
  });

  it('Should rethrow error for missing title upon creating new issue', async () => {
    const spy1 = jest.spyOn(IssueRepository, 'create')
      .mockReturnValueOnce(
        Promise.resolve(Issue.createInstance(validIssue, validAgent) as any),
      );
    const spy2 = jest.spyOn(AgentRepository, 'findByIdAndUpdate')
      .mockReturnValueOnce(
        validAgent as any,
      );
    try {
      await issueService.createNewIssue({ title: '' });
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('title for the issue must be provided');
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
    } finally {
      spy1.mockReset();
      spy2.mockReset();
    }
  });

  it('Should rethrow error if IssueRepository.create fails upon creating new issue', async () => {
    const spy1 = jest.spyOn(IssueRepository, 'create').mockRejectedValueOnce('Error' as any);
    const spy2 = jest.spyOn(AgentRepository, 'findByIdAndUpdate')
      .mockReturnValueOnce(
        validAgent as any,
      );
    try {
      await issueService.createNewIssue(validIssue);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toEqual('Error');
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    } finally {
      spy1.mockReset();
      spy2.mockReset();
    }
  });

  it('Should return filtered list of issue', async () => {
    IssueRepository.find =
      jest.fn().mockImplementationOnce(() =>
        ({ skip: jest.fn().mockImplementationOnce(() =>
          ({ limit: jest.fn().mockImplementationOnce(() =>
            ({ exec: jest.fn().mockReturnValueOnce(Promise.resolve([Issue.createInstance(validIssue)])) }),
          )}),
        )}),
      );
    IssueRepository.countDocuments =
      jest.fn().mockImplementationOnce(() =>
        ({ exec: jest.fn().mockReturnValueOnce(Promise.resolve(1)) }),
      );
    const retVal = await issueService.listAllIssue(0, 20, IssueStatusType.Assigned);
    expect(retVal).toBeDefined();
    expect(retVal.size).toEqual(20);
    expect(retVal.total).toEqual(1);
    expect(retVal.page).toEqual(0);
    expect(retVal.issues.length).toEqual(1);
    expect(retVal.issues[0].title).toEqual('Test');
  });

  it('Should rethrow error for negativ page upon return list of issue', async () => {
    try {
      await issueService.listAllIssue(-1);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('page can only be number bigger or equal to 0');
    }
  });

  it('Should rethrow error for negativ size upon return list of issue', async () => {
    try {
      await issueService.listAllIssue(0, -1);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('size can only be number bigger than 0 and less then 50');
    }
  });
});

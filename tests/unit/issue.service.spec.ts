import { IssueStatusType } from '../../src/models/enums';
import { Issue, IssueRepository } from '../../src/models/issue.model';
import issueService from '../../src/services/issue.service';

const validIssue: any = { title: 'Test' };

describe('Issue service unit testing', () => {
  it('Should create issue succesfuly', async () => {
    const spy = jest.spyOn(IssueRepository, 'create')
      .mockReturnValueOnce(
        Promise.resolve(validIssue),
      );
    await issueService.createNewIssue(validIssue);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
  });

  it('Should rethrow error for missing title upon creating new issue', async () => {
    const spy = jest.spyOn(IssueRepository, 'create')
      .mockReturnValueOnce(
        Promise.resolve(validIssue),
      );
    try {
      await issueService.createNewIssue({ title: '' });
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('title for the issue must be provided');
      expect(spy).toHaveBeenCalledTimes(0);
    } finally {
      spy.mockReset();
    }
  });

  it('Should rethrow error if IssueRepository.create fails upon creating new issue', async () => {
    const spy = jest.spyOn(IssueRepository, 'create').mockReturnValueOnce('Error' as any);
    try {
      await issueService.createNewIssue({ title: 'Test' });
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toEqual('Error');
    } finally {
      spy.mockReset();
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

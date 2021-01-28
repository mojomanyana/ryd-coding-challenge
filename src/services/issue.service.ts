import { Issue, IssueRepository } from '../models/issue.model';

class IssueService {
  public async createNewIssue(
    title: string,
  ): Promise<void> {
    const newInstance = new Issue(
      title,
    );
    await IssueRepository.create(newInstance);
  }
}

// Use singleton here
const issueService = new IssueService();

export default issueService;

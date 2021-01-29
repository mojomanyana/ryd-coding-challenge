import { IssueStatusType } from '../models/enums';
import { CreateIssueDto, Issue, IssueRepository, OutputIssueDto, PaginatedIssuesDto } from '../models/issue.model';

class IssueService {
  public async createNewIssue(
    createIssueDto: CreateIssueDto,
  ): Promise<OutputIssueDto> {
    const newInstance = Issue.createInstance(
      createIssueDto,
    );
    const retVal = await IssueRepository.create(newInstance);
    return new OutputIssueDto(retVal);
  }

  public async listAllIssue(
    page: number = 0,
    size: number = 20,
    issueStatusTypeFilter?: IssueStatusType,
  ): Promise<PaginatedIssuesDto> {
    if (page < 0) {
      throw new Error('page can only be number bigger or equal to 0');
    }
    if (size <= 0 || size > 50) {
      throw new Error('size can only be number bigger than 0 and less then 50');
    }

    const filter: any = {};
    if (issueStatusTypeFilter) {
      filter.status = issueStatusTypeFilter;
    }

    const issues = await IssueRepository.find(filter).skip(page * size).limit(size).exec();
    const total = await IssueRepository.countDocuments(filter).exec();
    return new PaginatedIssuesDto(
      page,
      total,
      size,
      issues,
    );
  }
}

// Use singleton here
const issueService = new IssueService();

export default issueService;

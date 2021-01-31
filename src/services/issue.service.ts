import { Agent, AgentRepository } from '../models/agent.model';
import { AgentStatusType, IssueStatusType } from '../models/enums';
import { CreateIssueDto, Issue, IssueRepository, OutputIssueDto, PaginatedIssuesDto } from '../models/issue.model';

class IssueService {
  public async createNewIssue(
    createIssueDto: CreateIssueDto,
  ): Promise<OutputIssueDto> {
    // Check first if there is some free agent to take this issue
    const freeAgents = await AgentRepository
      .find({ status: AgentStatusType.Free })
      .limit(1)
      .exec();

    const newInstance = Issue.createInstance(
      createIssueDto,
      (freeAgents && freeAgents.length > 0) ? freeAgents[0] : undefined,
    );

    const retVal = await IssueRepository.create(newInstance) as Issue;
    if (freeAgents && freeAgents.length > 0) {
      await AgentRepository.findByIdAndUpdate(
        freeAgents[0]._id,
        {
          issueAssigned: retVal,
          status: AgentStatusType.Working,
        },
      );
      (retVal.agentAssigned as Agent).status = AgentStatusType.Working;
    }
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

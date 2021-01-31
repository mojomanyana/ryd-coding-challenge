import { Agent, AgentRepository } from '../models/agent.model';
import { AgentStatusType, IssueStatusType } from '../models/enums';
import { CreateIssueDto, Issue, IssueRepository, OutputIssueDto, PaginatedIssuesDto, UpdateIssueDto } from '../models/issue.model';

class IssueService {
  public async createNewIssue(
    createIssueDto: CreateIssueDto,
  ): Promise<OutputIssueDto> {
    // Check first if there is some free agent to take this issue
    const freeAgents = await AgentRepository
      .find({ status: AgentStatusType.Free })
      .limit(1)
      .exec();

    // Create new instance of the issue
    const newInstance = Issue.createInstance(
      createIssueDto,
      (freeAgents && freeAgents.length > 0) ? freeAgents[0] : undefined,
    );

    const retVal = await IssueRepository.create(newInstance) as Issue;
    if (freeAgents && freeAgents.length > 0) {
      // Update agent asigned to this issue
      await AgentRepository.findByIdAndUpdate(
        freeAgents[0]._id, {
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

  public async resolveIssue(
    updateIssueDto: UpdateIssueDto,
  ): Promise<OutputIssueDto> {
    // Get issue by id first
    const issue = await IssueRepository.findById(updateIssueDto.id) as Issue;
    if (!issue) {
      throw new Error('unable to find issue for given id');
    }
    if (!issue.agentAssigned || issue.status === IssueStatusType.Resolved) {
      throw new Error('unable to resolve issue that has no agent or is already resolved');
    }

    // Get next open issue
    const openIssues = await IssueRepository
      .find({ status: IssueStatusType.Unassigned })
      .sort({ createdAt: 1 })
      .limit(1)
      .exec();

    // Resolve issue and remove agent assigned
    const issueUpdated = await IssueRepository.findByIdAndUpdate(
      issue._id, {
        agentAssigned: undefined,
        status: IssueStatusType.Resolved,
      }, {
        new: true,
      },
    ) as Issue;
    // Update agent and assign to new issue if available
    const updatedAgent = await AgentRepository.findByIdAndUpdate(
      (issue.agentAssigned as Agent)._id, {
        issueAssigned: (openIssues && openIssues.length > 0) ? openIssues[0] : undefined,
        status: (openIssues && openIssues.length > 0) ? AgentStatusType.Working : AgentStatusType.Free,
      }, {
        new: true,
      },
    ) as Agent;
    // Update new issue if available
    if (openIssues && openIssues.length > 0) {
      await IssueRepository.findByIdAndUpdate(
        openIssues[0]._id, {
          agentAssigned: updatedAgent,
          status: IssueStatusType.Assigned,
        },
      );
    }

    return new OutputIssueDto(issueUpdated);
  }
}

// Use singleton here
const issueService = new IssueService();

export default issueService;

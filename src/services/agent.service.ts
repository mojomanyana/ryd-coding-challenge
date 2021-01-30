import { Agent, AgentRepository, CreateAgentDto, OutputAgentDto, PaginatedAgentsDto } from '../models/agent.model';
import { AgentStatusType } from '../models/enums';

class AgentService {
  public async createNewAgent(
    createAgentDto: CreateAgentDto,
  ): Promise<OutputAgentDto> {
    const newInstance = Agent.createInstance(
      createAgentDto,
    );
    const retVal = await AgentRepository.create(newInstance);
    return new OutputAgentDto(retVal);
  }

  public async listAllAgents(
    page: number = 0,
    size: number = 20,
    agentStatusTypeFilter?: AgentStatusType,
  ): Promise<PaginatedAgentsDto> {
    if (page < 0) {
      throw new Error('page can only be number bigger or equal to 0');
    }
    if (size <= 0 || size > 50) {
      throw new Error('size can only be number bigger than 0 and less then 50');
    }

    const filter: any = {};
    if (agentStatusTypeFilter) {
      filter.status = agentStatusTypeFilter;
    }

    const agents = await AgentRepository.find(filter).skip(page * size).limit(size).exec();
    const total = await AgentRepository.countDocuments(filter).exec();
    return new PaginatedAgentsDto(
      page,
      total,
      size,
      agents,
    );
  }
}

// Use singleton here
const agentService = new AgentService();

export default agentService;

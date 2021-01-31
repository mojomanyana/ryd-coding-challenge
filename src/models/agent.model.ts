import {
  getModelForClass,
  modelOptions,
  plugin,
  prop,
  Ref,
} from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';
import { v4 } from 'uuid';
import { AgentStatusType } from './enums';
import { Issue, OutputIssueDto } from './issue.model';

@modelOptions({
  schemaOptions: {
    collection: 'agent',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@plugin(autopopulate)
class Agent {
  public static createInstance(createAgentDto: CreateAgentDto, issueToAssign?: Issue): Agent {
    if (!createAgentDto) {
      throw new Error('createAgentDto object must be provided');
    }

    const newInstance = new Agent(
      createAgentDto.username,
    );
    if (issueToAssign) {
      newInstance.issueAssigned = issueToAssign;
      newInstance.status = AgentStatusType.Working;
    }
    return newInstance;
  }
  @prop({ type: Date, required: true })
  public createdAt!: Date;

  @prop({ type: Date, required: true })
  public updatedAt!: Date;

  @prop({ type: String, default: AgentStatusType.Free, index: true, enum: AgentStatusType })
  public status!: string;

  @prop({ type: String, required: true, unique: true, index: true })
  public username!: string;

  @prop({ autopopulate: { maxDepth: 1 }, ref: 'Issue', type: String })
  public issueAssigned?: Ref<Issue>;

  @prop({ type: String, required: true })
  public _id!: string;

  public constructor(
    username: string,
  ) {
    if (!username || username.trim().length === 0) {
      throw new Error('username for the agent must be provided');
    }
    this.username = username;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this._id = v4();
  }
}

const AgentRepository = getModelForClass(Agent);
const AgentModel = AgentRepository.model('Agent');

class CreateAgentDto {
  public username: Agent['username'];
}

class OutputAgentDto extends CreateAgentDto {
  public status: Agent['status'];
  public id: Agent['_id'];
  public createdAt: Agent['createdAt'];
  public updatedAt: Agent['updatedAt'];
  public issueAssigned?: OutputIssueDto;

  constructor(agent: Agent) {
    super();
    this.status = agent.status;
    this.username = agent.username;
    this.createdAt = agent.createdAt;
    this.updatedAt = agent.updatedAt;
    this.id = agent._id;

    if (agent.issueAssigned) {
      this.issueAssigned = new OutputIssueDto(agent.issueAssigned as Issue);
    }
  }
}

class PaginatedAgentsDto {
  public page: number;
  public total: number;
  public size: number;
  public agents: OutputAgentDto[];

  constructor(page: number, total: number, size: number, agents: Agent[]) {
    this.page = page;
    this.total = total;
    this.size = size;
    this.agents = agents.map ((agent) => new OutputAgentDto(agent));
  }
}

export {
  AgentRepository,
  Agent,
  AgentModel,
  OutputAgentDto,
  CreateAgentDto,
  PaginatedAgentsDto,
};

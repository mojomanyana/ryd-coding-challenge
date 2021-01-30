import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { Agent, OutputAgentDto } from './agent.model';
import { IssueStatusType } from './enums';

@modelOptions({
  schemaOptions: {
    collection: 'issue',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
class Issue {
  public static createInstance(createIssueDto: CreateIssueDto, agentToAssign?: Agent): Issue {
    if (!createIssueDto) {
      throw new Error('createIssueDto object must be provided');
    }

    const newInstance = new Issue(
      createIssueDto.title,
    );
    if (agentToAssign) {
      newInstance.agentAssigned = agentToAssign;
    }
    return newInstance;
  }
  @prop({ type: Date, required: true })
  public createdAt: Date;

  @prop({ type: Date, required: true })
  public updatedAt: Date;

  @prop({ type: String, required: true })
  public title: string;

  @prop({ type: String, default: IssueStatusType.Unassigned, index: true, enum: IssueStatusType })
  public status: string;

  @prop({ ref: () => Agent })
  public agentAssigned?: Ref<Agent>;

  public _id: Schema.Types.ObjectId;

  public constructor(
    title: string,
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error('title for the issue must be provided');
    }

    this.title = title;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

const IssueRepository = getModelForClass(Issue);
const IssueModel = IssueRepository.model('Issue');

class CreateIssueDto {
  public title: Issue['title'];
}

class OutputIssueDto extends CreateIssueDto {
  public status: Issue['status'];
  public id: Issue['_id'];
  public createdAt: Issue['createdAt'];
  public updatedAt: Issue['updatedAt'];
  public agentAssigned?: OutputAgentDto;

  constructor(issue: Issue) {
    super();
    this.status = issue.status;
    this.title = issue.title;
    this.createdAt = issue.createdAt;
    this.updatedAt = issue.updatedAt;
    this.id = issue._id;

    if (issue.agentAssigned) {
      this.agentAssigned = new OutputAgentDto(issue.agentAssigned as Agent);
    }
  }
}

class PaginatedIssuesDto {
  public page: number;
  public total: number;
  public size: number;
  public issues: OutputIssueDto[];

  constructor(page: number, total: number, size: number, issues: Issue[]) {
    this.page = page;
    this.total = total;
    this.size = size;
    this.issues = issues.map((issue) => new OutputIssueDto(issue));
  }
}

export {
  IssueRepository,
  Issue,
  IssueModel,
  CreateIssueDto,
  OutputIssueDto,
  PaginatedIssuesDto,
};

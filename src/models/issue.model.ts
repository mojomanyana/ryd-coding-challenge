import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Agent } from './agent.model';
import { IssueStatusType } from './enums';

@modelOptions({
  schemaOptions: {
      collection: 'issue',
      toJSON: { virtuals: false },
  },
})
class Issue {
  public static createInstance(createIssueDto: CreateIssueDto): Issue {
    if (!createIssueDto) {
      throw new Error('createIssueDto object must be provided');
    }

    const newInstance = new Issue(
      createIssueDto.title,
    );
    return newInstance;
  }

  @prop({ type: String, required: true })
  public title: string;

  @prop({ type: String, default: IssueStatusType.Unassigned, index: true, enum: IssueStatusType })
  public status: string;

  @prop({ ref: Agent })
  public agentAssigned?: Ref<Agent>;

  public constructor(
    title: string,
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error('title for the issue must be provided');
    }

    this.title = title;
  }
}

const IssueRepository = getModelForClass(Issue);
const IssueModel = IssueRepository.model('Issue');

class CreateIssueDto {
  public title: string;
}

class OutputIssueDto {
  public title: string;
  public status: IssueStatusType;

  constructor(issue: Issue) {
    this.status = issue.status as IssueStatusType;
    this.title = issue.title;
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

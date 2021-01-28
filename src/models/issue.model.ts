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
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
  },
})
class Issue {
  @prop({ type: String, required: true })
  public title: string;

  @prop({ type: Number, default: IssueStatusType.Unassigned, index: true, enum: IssueStatusType })
  public status: number;

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

export {
  IssueRepository,
  Issue,
  IssueModel,
};

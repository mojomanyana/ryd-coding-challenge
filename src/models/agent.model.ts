import {
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
      collection: 'agent',
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
  },
})
class Agent {
  @prop({ type: String, required: true })
  public username: string;

  public constructor(
    username: string,
  ) {
    this.username = username;
  }
}

const AgentRepository = getModelForClass(Agent);
const AgentModel = AgentRepository.model('Agent');

export {
  AgentRepository,
  Agent,
  AgentModel,
};

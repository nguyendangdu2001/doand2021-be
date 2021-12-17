import { FilterQuery, Model } from 'mongoose';

export abstract class AbstractService<T, S = T & Document> {
  private model: Model<S>;
  constructor(model: Model<S>) {
    this.model = model;
  }
  async create(input: T) {
    const newDocument = await this.model.create(input);
    // this.createNewUserNode(newUser.id);
    return newDocument;
  }

  async findAll() {
    const getCount = this.model.countDocuments();
    const getUser = this.model.find({});

    return await Promise.all([await getUser, await getCount]);
  }

  async findOne(query: FilterQuery<S>) {
    return await this.model.findOne(query);
  }

  findOneById(id: string) {
    return this.model.findById(id);
  }

  update(id: string, updateUserInput: T) {
    return this.model.findByIdAndUpdate(id, updateUserInput);
  }

  remove(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}

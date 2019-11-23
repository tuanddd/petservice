import User from "../model/User";
import CrudService from "../class/crud-service";
import { Op } from "sequelize";

export default class UserService extends CrudService<User, typeof User> {
  model: typeof User;

  constructor() {
    super(User);
  }

  async getOneByUserUid(providerUserId: string): Promise<User> {
    return await this.model.findOne({
      where: { providerUserId },
      include: Object.values(this.model.associations)
    });
  }


  async createUserWithProvider(provider: string, id: string, user: Pick<User, 'name' | 'email' | 'roleId' | 'petDataJson'>): Promise<User> {
    try {
      return await this.model.create({ ...user, provider, providerUserId: id });
    } catch (error) {
      return Promise.reject(error);
    }
  }

}

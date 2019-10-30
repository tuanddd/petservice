import BaseService from "../class/base-service";
import User from "../model/User";
import { compare } from "bcrypt";
import Role from "../model/Role";

export default class LoginService extends BaseService<User, typeof User> {
  constructor() {
    super(User);
  }

  async login(credentials: {
    username: string;
    password: string;
  }): Promise<User | false> {
    let user = await this.model.findOne({
      include: [Role],
      where: { email: credentials.username }
    });
    if (user !== null) {
      let valid = await compare(credentials.password, user.password);
      return Promise.resolve(valid ? user : false);
    }

    return Promise.resolve(false);
  }

  async getMe(id: number): Promise<User> {
    let user = await this.model.findByPk(id, { include: [Role] });
    return Promise.resolve(user);
  }
}

import User from "../model/User";
import UserService from "../service/user";
import CrudRouter from "../class/crud-router";

export default class UserRouter extends CrudRouter<User, typeof User> {
  readonly service = new UserService();
  constructor() {
    super(User);

    this.router.post(`/custom/register-user-firebase`, async (req, res) => {
      let { userId, name = 'user', email } = req.body;
      res.status(200).json(await this.service.createUserWithProvider('firebase', userId, { email, name, petDataJson: '', roleId: 3 }))
    })
  }
}

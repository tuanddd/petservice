import User from "../model/User";
import UserService from "../service/user";
import CrudRouter from "../class/crud-router";
import { Op } from "sequelize";

export default class UserRouter extends CrudRouter<User, typeof User> {
  readonly service = new UserService();
  constructor() {
    super(User);

    this.router.get(`/custom/uid`,async (req,res) => {
      let { providerUserId } = req.query;
      console.log("================");
      console.log(providerUserId);
      console.log("================");
      res.status(200).json(await this.service.getOneByUserUid(providerUserId));

    })

    this.router.get(`/custom/firebaseUsers`,async (req,res) => {
      let { providerUserId } = req.query;
      console.log("================");
      console.log(providerUserId);
      console.log("================");
      res.status(200).json(await this.service.getAll({ provider : 'firebase', providerUserId : { [Op.ne] : providerUserId }}));

    })

    this.router.put(`/custom/uid`,async (req,res) => {
      let { providerUserId, petDataJson } = req.body;
      console.log("================");
      console.log(providerUserId);
      console.log("================");
      res.status(200).json(await this.service.updatePetsDataJsonUserByUid(providerUserId,petDataJson));

    })

    this.router.post(`/custom/register-user-firebase`, async (req, res) => {
      let { userId, name = 'user', email } = req.body;
      res.status(200).json(await this.service.createUserWithProvider('firebase', userId, { email, name, petDataJson: '', roleId: 3 }))
    })
  }
}

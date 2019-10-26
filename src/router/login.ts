import BaseRouter from "../class/base-router";
import User from "../model/User";
import * as express from "express";
import LoginService from "../service/login";

export default class LoginRouter extends BaseRouter<User, typeof User> {
  readonly service = new LoginService();
  constructor() {
    super();

    this.router.post(
      ``,
      async (req: express.Request, res: express.Response) => {
        let credentials: { username: string; password: string } = req.body;
        let valid = await this.service.login(credentials);
        if (valid) {
          valid.password = null;
          res.status(200).json(valid);
        } else {
          res.status(401).end();
        }
      }
    );
  }
}

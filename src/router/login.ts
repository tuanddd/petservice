import BaseRouter from "../class/base-router";
import User from "../model/User";
import * as express from "express";
import LoginService from "../service/login";
import { sign, verify } from "jsonwebtoken";

export default class LoginRouter extends BaseRouter<User, typeof User> {
  readonly service = new LoginService();
  constructor() {
    super();

    this.router.post(
      `/login`,
      async (req: express.Request, res: express.Response) => {
        let credentials: { username: string; password: string } = req.body;
        if (!credentials.username || !credentials.password) {
          res.status(400).end("Please provide username/password.");
        } else {
          let valid = await this.service.login(credentials);
          if (valid) {
            valid.password = null;
            res.status(200).json({
              user: valid,
              token: sign(valid.id.toString(), process.env.JWT_SECRET)
            });
          } else {
            res.status(401).end("Wrong username/password.");
          }
        }
      }
    );

    this.router.get(
      `/me`,
      async (
        req: express.Request & { userId: number; token: string },
        res: express.Response
      ) => {
        let user = await this.service.getMe(req.userId);
        if (user) {
          res.status(200).json({ user, token: req.token });
        } else {
          res.status(400).end("User not found.");
        }
      }
    );
  }
}

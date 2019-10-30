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
      async (req: express.Request, res: express.Response) => {
        let regex = /(Bearer|bearer) (.+)/;
        let token = req.headers.authorization.match(regex)[2];
        if (token) {
          try {
            let id = (verify(
              token,
              process.env.JWT_SECRET
            ) as unknown) as number;
            let user = await this.service.getMe(id);
            if (user) {
              res.status(200).json({ user, token });
            } else {
              res.status(400).end("User not found.");
            }
          } catch (error) {
            res.status(400).json(error);
          }
        } else {
          res.status(401).end("Unauthorized.");
        }
      }
    );
  }
}

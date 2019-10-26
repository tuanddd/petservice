import * as express from "express";
import { Model, ValidationError } from "sequelize/types";
import BaseService from "./base-service";
import { GenericStaticType } from "../interface/base-service";
import IBaseRouter from "../interface/base-router";

export default class BaseRouter<E extends Model, M extends GenericStaticType<E>>
  implements IBaseRouter<E, M> {
  readonly router = express.Router();
  service: BaseService<E, M>;

  constructor(type: M) {
    this.service = new BaseService(type);
    this.router.get(
      ``,
      async (_req: express.Request, res: express.Response) => {
        try {
          let result = await this.service.getAll();
          res.status(200).json(result);
        } catch (error) {
          res.status(400).json((error as ValidationError).message);
        }
      }
    );

    this.router.get(
      `:id`,
      async (req: express.Request, res: express.Response) => {
        try {
          let result = await this.service.getOne((req.params
            .id as unknown) as number);
          res.status(200).json(result);
        } catch (error) {
          res.status(400).json((error as ValidationError).message);
        }
      }
    );

    this.router.post(
      ``,
      async (req: express.Request, res: express.Response) => {
        try {
          let result: E = await this.service.create(req.body as E);
          res.status(201).json(result);
        } catch (error) {
          res.status(400).json((error as ValidationError).message);
        }
      }
    );

    this.router.put(
      `:id`,
      async (req: express.Request, res: express.Response) => {
        try {
          let result = await this.service.edit({
            ...req.body,
            id: req.params.id
          });
          res.status(200).json(result);
        } catch (error) {}
      }
    );

    this.router.delete(
      `:id`,
      async (req: express.Request, res: express.Response) => {
        try {
          let numRowAffected = await this.service.remove((req.params
            .id as unknown) as number);
          res.status(200).json(numRowAffected);
        } catch (error) {
          res.status(400).json((error as ValidationError).message);
        }
      }
    );
  }
}

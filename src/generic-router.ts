import * as express from "express";
import { Model, ValidationError } from "sequelize/types";
import GenericRepository from "./generic-repository";
import { GenericStaticType } from "./interface/generic-repository";

export default class GenericRouter<
  E extends Model,
  M extends GenericStaticType<E>
> {
  readonly router = express.Router();
  repository: GenericRepository<E, M>;

  constructor(type: M) {
    this.repository = new GenericRepository(type);
    this.router.get(
      ``,
      async (_req: express.Request, res: express.Response) => {
        try {
          let result = await this.repository.getAll();
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
          let result = await this.repository.getOne((req.params
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
          let result: E = await this.repository.create(req.body as E);
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
          let result = await this.repository.edit({
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
          let numRowAffected = await this.repository.remove((req.params
            .id as unknown) as number);
          res.status(200).json(numRowAffected);
        } catch (error) {
          res.status(400).json((error as ValidationError).message);
        }
      }
    );
  }
}

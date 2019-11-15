import { Model, ValidationError } from "sequelize/types";
import { GenericStaticType } from "../interface/base-service-newfile";
import { ICrudRouter } from "../interface/crud-router";
import * as express from "express";
import { ICrudService } from "../interface/crud-service";
import CrudService from "./crud-service";

export default class CrudRouter<E extends Model, M extends GenericStaticType<E>>
  implements ICrudRouter<E, M> {
  readonly router = express.Router();
  service: ICrudService<E, M>;
  constructor(type: M) {
    this.service = new CrudService(type);
    this.router.get(``, async (req: express.Request, res: express.Response) => {
      try {
        let params = req.query;
        let result = await this.service.getAll(params);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json((error as ValidationError).message);
      }
    });

    this.router.get(
      `/:id`,
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
          let bulk = req.query.bulk;
          if (bulk) {
            let result = await this.service.createBulk(req.body as Array<E>);
            res.status(201).json(result);
          } else {
            let result: E = await this.service.create(req.body as E);
            res.status(201).json(result);
          }
        } catch (error) {
          res.status(400).json((error as ValidationError).message);
        }
      }
    );

    this.router.put(
      `/:id`,
      async (req: express.Request, res: express.Response) => {
        try {
          let result = await this.service.edit({
            ...req.body,
            id: req.params.id
          });
          res.status(200).json(result);
        } catch (error) { }
      }
    );

    this.router.delete(
      ``,
      async (req: express.Request, res: express.Response) => {
        try {
          let numRowAffected = await this.service.removeByParams(req.query);
          res.status(200).json(numRowAffected);
        } catch (error) {
          res.status(400).json((error as ValidationError).message);
        }
      }
    );

    this.router.delete(
      `/:id`,
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

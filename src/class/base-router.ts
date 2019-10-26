import * as express from "express";
import { Model, ValidationError } from "sequelize/types";
import BaseService from "./base-service";
import { GenericStaticType, IBaseService } from "../interface/base-service";
import { IBaseRouter } from "../interface/base-router";

export default class BaseRouter<E extends Model, M extends GenericStaticType<E>>
  implements IBaseRouter<E, M> {
  readonly router = express.Router();
  service: IBaseService<E, M>;

  constructor() {}
}

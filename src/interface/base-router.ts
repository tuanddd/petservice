import * as express from "express";
import { IBaseService, GenericStaticType } from "./base-service";
import { Model } from "sequelize/types";

export interface IBaseRouter<E extends Model, M extends GenericStaticType<E>> {
  router: express.Router;
  service: IBaseService<E, M>;
}

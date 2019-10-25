import * as express from "express";
import { IGenericRepository, GenericStaticType } from "./generic-repository";
import { Model } from "sequelize/types";

export default interface IGenericRouter<
  E extends Model,
  M extends GenericStaticType<E>
> {
  router: express.Router;
  repository: IGenericRepository<E, M>;
}

import { Model } from "sequelize/types";
import { GenericStaticType } from "../interface/generic-repository";
import GenericRouter from "../generic-router";
import IGenericRouter from "../interface/generic-router";

export default class BaseRouter<E extends Model, M extends GenericStaticType<E>>
  extends GenericRouter<E, M>
  implements IGenericRouter<E, M> {}

import { Model } from "sequelize";
import { GenericStaticType, IBaseService } from "../interface/base-service-newfile";

export default class BaseService<
  E extends Model,
  M extends GenericStaticType<E>
  > implements IBaseService<E, M> {
  constructor(public model: M) { }
}

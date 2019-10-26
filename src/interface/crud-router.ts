import { Model } from "sequelize/types";
import { GenericStaticType } from "./\bbase-service";
import { ICrudService } from "./crud-service";
import { IBaseRouter } from "./base-router";

export interface ICrudRouter<E extends Model, M extends GenericStaticType<E>>
  extends IBaseRouter<E, M> {
  service: ICrudService<E, M>;
}

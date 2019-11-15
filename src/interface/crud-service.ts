import { Model, WhereOptions } from "sequelize/types";
import { IBaseService, GenericStaticType } from "./base-service-newfile";

export interface ICrudService<E extends Model, M extends GenericStaticType<E>>
  extends IBaseService<E, M> {
  getAll(params?: WhereOptions): Promise<Array<E>>;
  getOne(id: number): Promise<E | null>;
  create(model: E): Promise<E>;
  createBulk(models: Array<E>): Promise<Array<E>>;
  edit(model: { id: number }): Promise<E>;
  remove(id: number): Promise<number>;
  removeByParams(params: WhereOptions): Promise<number>;
}

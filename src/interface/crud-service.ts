import { Model, WhereOptions } from "sequelize/types";
import { IBaseService, GenericStaticType } from "./\bbase-service";

export interface ICrudService<E extends Model, M extends GenericStaticType<E>>
  extends IBaseService<E, M> {
  getAll(params?: WhereOptions): Promise<Array<E>>;
  getOne(id: number): Promise<E | null>;
  create(user: E): Promise<E>;
  edit(user: { id: number }): Promise<E>;
  remove(id: number): Promise<number>;
}

import { Model, BuildOptions } from "sequelize";

export type GenericStaticType<E extends Model> = typeof Model & {
  new (values?: object, options?: BuildOptions): E;
};

export interface IBaseService<E extends Model, M extends GenericStaticType<E>> {
  model: M;
  getAll(): Promise<Array<E>>;
  getOne(id: number): Promise<E | null>;
  create(user: E): Promise<E>;
  edit(user: { id: number }): Promise<E>;
  remove(id: number): Promise<number>;
}

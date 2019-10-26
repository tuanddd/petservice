import { Model, BuildOptions } from "sequelize";

export type GenericStaticType<E extends Model> = typeof Model & {
  new (values?: object, options?: BuildOptions): E;
};

export interface IBaseService<E extends Model, M extends GenericStaticType<E>> {
  model: M;
}

import { Model } from "sequelize";

export interface IImportCSV {
  importCSV<E extends Model>(data: string | Buffer): Promise<Array<E> | false>;
}

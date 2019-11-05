import { Model } from "sequelize";

export interface IImportCSV<E extends Model> {
  import(data: string | Buffer): Promise<boolean>;
}

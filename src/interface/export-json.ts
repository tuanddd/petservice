import { Model } from "sequelize/types";

export default interface IExportJSON {
  exportJSON<E extends Model>(data?: Array<E> | E): Promise<string>;
}

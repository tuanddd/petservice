import { Model } from "sequelize/types";
import { GenericStaticType } from "../interface/\bbase-service";

export default class ExportService {
  constructor() {}

  async exportJSON<E extends Model, M extends GenericStaticType<E>>(
    model: M
  ): Promise<Array<E> | E> {
    return await model.findAll();
  }
}

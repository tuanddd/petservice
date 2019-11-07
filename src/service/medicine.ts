import CrudService from "../class/crud-service";
import Medicine from "../model/Medicine";
import * as csv from "neat-csv";
import { IImportCSV } from "../interface/import-csv";
import IExportJSON from "../interface/export-json";

export default class MedicineService
  extends CrudService<Medicine, typeof Medicine>
  implements IImportCSV, IExportJSON {
  constructor() {
    super(Medicine);
  }

  async exportJSON<Medicine>(data?: Medicine | Medicine[]): Promise<string> {
    try {
      if (data === undefined) {
        data = ((await this.model.findAll()) as any) as Medicine[];
      }
      return Promise.resolve(JSON.stringify(data));
    } catch (error) {
      return Promise.resolve("");
    }
  }

  async importCSV<Medicine>(data: Buffer): Promise<Array<Medicine> | false> {
    try {
      let result = await csv(data);
      this.model.bulkCreate(result);
      return Promise.resolve((result as any) as Array<Medicine>);
    } catch (error) {
      return Promise.resolve(false);
    }
  }
}

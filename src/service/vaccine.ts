import CrudService from "../class/crud-service";
import Vaccine from "../model/Vaccine";
import { IImportCSV } from "../interface/import-csv";
import * as csv from "neat-csv";

export default class VaccineService extends CrudService<Vaccine, typeof Vaccine>
  implements IImportCSV<Vaccine> {
  constructor() {
    super(Vaccine);
  }

  async import(data: string | Buffer): Promise<boolean> {
    try {
      let result = await csv(data);
      this.model.bulkCreate(result);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  }
}

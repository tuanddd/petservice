import CrudService from "../class/crud-service";
import Virus from "../model/Virus";
import { IImportCSV } from "../interface/import-csv";
import * as csv from "neat-csv";

export default class VirusService extends CrudService<Virus, typeof Virus>
  implements IImportCSV<Virus> {
  constructor() {
    super(Virus);
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

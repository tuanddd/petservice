import CrudService from "../class/crud-service";
import Virus from "../model/Virus";
import { IImportCSV } from "../interface/import-csv";
import * as csv from "neat-csv";

export default class VirusService extends CrudService<Virus, typeof Virus>
  implements IImportCSV {
  constructor() {
    super(Virus);
  }

  async importCSV<Virus>(data: string | Buffer): Promise<Array<Virus> | false> {
    try {
      let result = await csv(data);
      this.model.bulkCreate(result);
      return Promise.resolve((result as any) as Array<Virus>);
    } catch (error) {
      return Promise.resolve(false);
    }
  }
}

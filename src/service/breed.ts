import CrudService from "../class/crud-service";
import Breed from "../model/Breed";
import * as csv from "neat-csv";
import { IImportCSV } from "../interface/import-csv";
import IExportJSON from "../interface/export-json";

export default class BreedService extends CrudService<Breed, typeof Breed>
  implements IImportCSV, IExportJSON {
  constructor() {
    super(Breed);
  }

  async exportJSON<Breed>(data?: Breed | Breed[]): Promise<string> {
    try {
      if (data === undefined) {
        data = ((await this.model.findAll()) as any) as Breed[];
      }
      return Promise.resolve(JSON.stringify(data));
    } catch (error) {
      return Promise.resolve("");
    }
  }

  async importCSV<Breed>(data: Buffer): Promise<Array<Breed> | false> {
    try {
      let result = await csv(data);
      this.model.bulkCreate(result);
      return Promise.resolve((result as any) as Array<Breed>);
    } catch (error) {
      return Promise.resolve(false);
    }
  }
}

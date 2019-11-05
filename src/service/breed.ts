import CrudService from "../class/crud-service";
import Breed from "../model/Breed";
import { UploadedFile } from "express-fileupload";
import * as csv from "neat-csv";
import { IImportCSV } from "../interface/import-csv";

export default class BreedService extends CrudService<Breed, typeof Breed>
  implements IImportCSV<Breed> {
  constructor() {
    super(Breed);
  }

  async import(data: Buffer): Promise<boolean> {
    try {
      let result = await csv(data);
      this.model.bulkCreate(result);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  }
}

import CrudService from "../class/crud-service";
import Breed from "../model/Breed";
import { UploadedFile } from "express-fileupload";
import * as csv from "neat-csv";

export default class BreedService extends CrudService<Breed, typeof Breed> {
  constructor() {
    super(Breed);
  }

  async importCSV(file: UploadedFile): Promise<boolean> {
    try {
      let result = await csv(file.data);
      this.model.bulkCreate(result);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  }
}

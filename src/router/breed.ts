import CrudRouter from "../class/crud-router";
import Breed from "../model/Breed";
import BreedService from "../service/breed";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

export default class BreedRouter extends CrudRouter<Breed, typeof Breed> {
  readonly service = new BreedService();
  constructor() {
    super(Breed);

    this.router.post(
      `/custom/import-csv`,
      async (
        req: Request & { files: { csv: { data: Buffer } } },
        res: Response
      ) => {
        res
          .status(200)
          .end((await this.service.import(req.files.csv.data)).toString());
      }
    );
  }
}

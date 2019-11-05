import CrudRouter from "../class/crud-router";
import Virus from "../model/Virus";
import VirusService from "../service/virus";
import { Request } from "express";

export default class VirusRouter extends CrudRouter<Virus, typeof Virus> {
  service = new VirusService();
  constructor() {
    super(Virus);

    this.router.post(
      `/custom/import-csv`,
      async (req: Request & { files: { csv: { data: Buffer } } }, res) => {
        res
          .status(200)
          .end((await this.service.import(req.files.csv.data)).toString());
      }
    );
  }
}

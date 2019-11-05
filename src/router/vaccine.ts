import CrudRouter from "../class/crud-router";
import Vaccine from "../model/Vaccine";
import VaccineService from "../service/Vaccine";
import { Request } from "express";
import { writeFileSync, unlinkSync } from "fs";
import { resolve } from "path";

export default class VaccineRouter extends CrudRouter<Vaccine, typeof Vaccine> {
  service = new VaccineService();
  constructor() {
    super(Vaccine);

    this.router.post(
      `/custom/import-csv`,
      async (req: Request & { files: { csv: { data: Buffer } } }, res) => {
        res
          .status(200)
          .end((await this.service.import(req.files.csv.data)).toString());
      }
    );

    this.router.get(`/custom/export-json`, async (_req, res) => {
      let result = await this.service.getAll();
      let jsonString = JSON.stringify(result);
      let path = resolve(__dirname, `../temp-data/data.json`);
      writeFileSync(path, jsonString);
      let mimeType = "application/json";
      let filename = "data.json";
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-disposition", `attachment; filename=${filename}`);
      res.download(path);
      // unlinkSync(path);
    });
  }
}

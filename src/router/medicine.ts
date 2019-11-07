import CrudRouter from "../class/crud-router";
import Medicine from "../model/Medicine";
import MedicineService from "../service/medicine";
import { Request, Response } from "express";
import { resolve } from "path";
import { writeFileSync } from "fs";

export default class MedicineRouter extends CrudRouter<
  Medicine,
  typeof Medicine
> {
  readonly service = new MedicineService();
  constructor() {
    super(Medicine);

    this.router.post(
      `/custom/import-csv`,
      async (
        req: Request & { files: { csv: { data: Buffer } } },
        res: Response
      ) => {
        res
          .status(200)
          .end((await this.service.importCSV(req.files.csv.data)).toString());
      }
    );

    this.router.get(`/custom/export-json`, async (req, res) => {
      let jsonString = await this.service.exportJSON();
      let path = resolve(__dirname, `../temp-data/data.json`);
      writeFileSync(path, jsonString);
      let mimeType = "application/json";
      let filename = "data.json";
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-disposition", `attachment; filename=${filename}`);
      res.download(path);
    });
  }
}

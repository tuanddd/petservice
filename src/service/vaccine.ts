import CrudService from "../class/crud-service";
import Vaccine from "../model/Vaccine";
import { IImportCSV } from "../interface/import-csv";
import * as csv from "neat-csv";
import IExportJSON from "../interface/export-json";
import Virus from "../model/Virus";
import VaccineVirus from "../model/VaccineVirus";

interface CustomExportJSONType {
  listVirus: Array<Virus>;
  listVaccine: Array<Vaccine>;
  listVaccineVirus: Array<VaccineVirus>;
}

export default class VaccineService extends CrudService<Vaccine, typeof Vaccine>
  implements IImportCSV, IExportJSON {
  constructor() {
    super(Vaccine);
  }

  async exportJSON(): Promise<string> {
    try {
      let listVirus = await Virus.findAll();
      let listVaccineVirus = await VaccineVirus.findAll();
      let listVaccine = await Vaccine.findAll();
      let result: CustomExportJSONType = {
        listVirus,
        listVaccineVirus,
        listVaccine
      };
      return Promise.resolve(JSON.stringify(result));
    } catch (error) {
      return Promise.resolve("");
    }
  }

  async importCSV<Vaccine>(
    data: string | Buffer
  ): Promise<Array<Vaccine> | false> {
    try {
      let result = await csv(data);
      this.model.bulkCreate(result);
      return Promise.resolve((result as any) as Array<Vaccine>);
    } catch (error) {
      return Promise.resolve(false);
    }
  }
}

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export default class VaccineVirus extends Model {}
VaccineVirus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  { sequelize, modelName: "vaccineVirus" }
);

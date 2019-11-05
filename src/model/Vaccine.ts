import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export const enum VACCINE_TYPE_ENUM {
  SINGLE = 1,
  MULTIPLE
}

export default class Vaccine extends Model {}
Vaccine.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: DataTypes.STRING,
    type: {
      type: DataTypes.INTEGER,
      defaultValue: VACCINE_TYPE_ENUM.SINGLE,
      allowNull: false
    }
  },
  { sequelize, modelName: "vaccine" }
);

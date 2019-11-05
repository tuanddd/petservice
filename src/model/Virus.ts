import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export default class Virus extends Model {}
Virus.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: DataTypes.STRING
  },
  { sequelize, modelName: "virus" }
);

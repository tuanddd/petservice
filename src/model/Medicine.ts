import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export default class Medicine extends Model {}
Medicine.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: DataTypes.STRING
  },
  { sequelize, modelName: "medicine" }
);

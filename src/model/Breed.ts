import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export default class Breed extends Model {}
Breed.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: DataTypes.STRING
  },
  { sequelize, modelName: "breed" }
);

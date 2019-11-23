import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export enum PET_TYPE_ID {
  DOG = 1,
  CAT,
  OTHER
}

export default class Breed extends Model { }
Breed.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: DataTypes.STRING,
    petTypeId: {
      type: DataTypes.INTEGER,
      defaultValue: PET_TYPE_ID.DOG
    }
  },
  { sequelize, modelName: "breed" }
);

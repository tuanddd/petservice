import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export default class Role extends Model {}
Role.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING
  },
  { sequelize, modelName: "role" }
);

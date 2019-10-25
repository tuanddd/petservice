import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export default class Shop extends Model {}
Shop.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longtitude: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Inactive", "Active"),
      defaultValue: "Inactive",
      allowNull: false
    }
  },
  { sequelize, modelName: "shop" }
);

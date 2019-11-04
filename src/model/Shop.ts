import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export const enum SHOP_STATUS_ENUM {
  INACTIVE = 1,
  ACTIVE
}

export default class Shop extends Model {}
Shop.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: process.env.DEFAULT_SHOP_ICON
    },
    description: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longtitude: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: SHOP_STATUS_ENUM.INACTIVE,
      allowNull: false
    }
  },
  { sequelize, modelName: "shop" }
);

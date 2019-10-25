import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export default class ShopService extends Model {}
ShopService.init(
  {
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    unit: DataTypes.STRING,
    description: DataTypes.STRING
  },
  {
    sequelize,
    modelName: "shop_service",
    tableName: "shop_services",
    freezeTableName: true
  }
);

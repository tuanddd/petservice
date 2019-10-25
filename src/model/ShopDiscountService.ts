import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection";

export default class ShopDiscountService extends Model {}
ShopDiscountService.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  { sequelize, modelName: "shopDiscountService" }
);

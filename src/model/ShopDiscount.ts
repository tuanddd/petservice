import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export default class ShopDiscount extends Model {}
ShopDiscount.init(
  {
    value: DataTypes.STRING,
    unit: DataTypes.STRING,
    validFrom: DataTypes.DATE,
    validUntil: DataTypes.DATE,
    code: {
      type: DataTypes.STRING,
      unique: true
    },
    status: {
      type: DataTypes.ENUM("Unused", "Used"),
      defaultValue: "Unused",
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "shop_discount",
    tableName: "shop_discounts",
    freezeTableName: true
  }
);

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export const enum SHOP_DISCOUNT_ENUM {
  UNUSED = 1,
  USED
}

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
      type: DataTypes.INTEGER,
      defaultValue: SHOP_DISCOUNT_ENUM.UNUSED,
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

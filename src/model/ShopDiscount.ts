import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export const enum SHOP_DISCOUNT_STATUS_ENUM {
  UNUSED = 1,
  USED
}

export const enum SHOP_DISCOUNT_TYPE_ENUM {
  PERCENT = 1,
  RAW_VALUE
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
    type: {
      type: DataTypes.INTEGER,
      defaultValue: SHOP_DISCOUNT_TYPE_ENUM.PERCENT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: SHOP_DISCOUNT_STATUS_ENUM.UNUSED,
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

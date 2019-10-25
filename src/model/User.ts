import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection";

export default class User extends Model {}
User.init(
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize, modelName: "user" }
);

import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection";
import Role from "./Role";

export default class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public role?: Role;
  public roldId!: number;
}
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

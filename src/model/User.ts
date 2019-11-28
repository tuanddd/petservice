import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection";
import Role from "./Role";
import { hashSync } from 'bcrypt'

export default class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public provider: string;
  public providerUserId: string;
  public petDataJson: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public role?: Role;
  public roleId!: number;
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
    },
    name: {
      type: DataTypes.STRING,
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    providerUserId: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    petDataJson: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  },
  { sequelize, modelName: "user" }
);

User.beforeCreate('hashPassword', user => {
  if (user.password)
    user.password = hashSync(user.password, 10);
})

User.beforeBulkCreate('hashPasswordBulk', users => {
  users.forEach(u => {
    if (u.password)
      u.password = hashSync(u.password, 10)
  })
})

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("petservice", "root", null, {
  host: "localhost",
  dialect: "mysql",
  // logging: false,
  define: {
    underscored: true,
    timestamps: true
  }
});

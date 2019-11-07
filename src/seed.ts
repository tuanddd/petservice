import { sequelize } from "./connection";
import User from "./model/User";
import Role from "./model/Role";
import ShopService from "./model/ShopService";
import Shop from "./model/Shop";
import ShopDiscount from "./model/ShopDiscount";
import { addDays } from "date-fns";
import ShopDiscountService from "./model/ShopDiscountService";
import { hashSync } from "bcrypt";
import VaccineVirus from "./model/VaccineVirus";
import Virus from "./model/Virus";
import Vaccine from "./model/Vaccine";
import * as csv from "neat-csv";
import { resolve } from "path";
import { readFileSync } from "fs";

const salt = 10;

export const init: () => Promise<boolean> = () => {
  return sequelize
    .authenticate()
    .then(() => {
      console.log("=".repeat(100));
      console.log("Authentication OK");
      console.log("=".repeat(100));

      User.belongsTo(Role, {
        foreignKey: {
          allowNull: false
        }
      });
      User.hasMany(Shop);
      Shop.belongsTo(User);
      User.hasMany(ShopService, {
        foreignKey: {
          allowNull: false
        }
      });
      ShopService.belongsTo(User, {
        foreignKey: {
          allowNull: false
        }
      });
      ShopService.belongsTo(Shop, {
        foreignKey: {
          allowNull: false
        }
      });
      User.hasMany(ShopDiscount, {
        foreignKey: {
          allowNull: false
        }
      });
      ShopDiscount.belongsTo(User);
      ShopDiscount.belongsTo(Shop, {
        foreignKey: {
          allowNull: false
        }
      });

      Shop.hasMany(ShopDiscount);
      Shop.hasMany(ShopService);
      Shop.hasMany(ShopDiscountService);
      ShopDiscountService.belongsTo(Shop);

      ShopDiscountService.belongsTo(ShopDiscount);
      ShopDiscountService.belongsTo(ShopService);

      ShopDiscount.belongsToMany(ShopService, {
        through: ShopDiscountService
      });
      ShopService.belongsToMany(ShopDiscount, {
        through: ShopDiscountService
      });

      VaccineVirus.belongsTo(Virus);
      VaccineVirus.belongsTo(Vaccine);

      Vaccine.hasMany(VaccineVirus);

      Virus.belongsToMany(Vaccine, {
        through: VaccineVirus
      });

      Vaccine.belongsToMany(Virus, { through: VaccineVirus });

      console.log("=".repeat(100));
      console.log("Setting associations OK");
      console.log("=".repeat(100));

      return sequelize.sync({ force: true }).then(async () => {
        await Role.create({
          name: "ADMIN"
        }).then(role => {
          User.bulkCreate([
            {
              email: "tuand@gmail.com",
              password: hashSync("123456", salt),
              name: "Tuan",
              roleId: role.get("id")
            }
          ]);
        });

        await Role.create({
          name: "SHOP_MANAGER"
        }).then(role => {
          User.bulkCreate([
            {
              email: "vutnq@gmail.com",
              password: hashSync("123456", salt),
              name: "Vu",
              roleId: role.get("id")
            },
            {
              email: "khuetla@gmail.com",
              password: hashSync("123456", salt),
              name: "Khue",
              roleId: role.get("id")
            }
          ]);
        });

        await Shop.bulkCreate([
          {
            name: "Shop SH1",
            status: 2,
            userId: 2
          },
          {
            name: "Shop SH2",
            status: 2,
            userId: 2
          },
          {
            name: "Shop SH3",
            status: 1,
            userId: 3
          }
        ]);

        await ShopService.bulkCreate([
          {
            name: "Service S1",
            price: "5000",
            unit: "VND",
            shopId: 1,
            userId: 2
          },
          {
            name: "Service S2",
            price: "10000",
            unit: "VND",
            shopId: 2,
            userId: 2
          },
          {
            name: "Service S3",
            price: "15000",
            unit: "VND",
            shopId: 1,
            userId: 2
          }
        ]);

        ShopDiscount.bulkCreate([
          {
            value: "50",
            unit: "VND",
            validFrom: new Date(),
            validUntil: addDays(new Date(), 5),
            code: "DISCOUNT#1",
            type: 1,
            status: 1,
            userId: 2,
            shopId: 1
          },
          {
            value: "5000",
            unit: "VND",
            validFrom: new Date(),
            validUntil: addDays(new Date(), 5),
            code: "DISCOUNT#2",
            type: 2,
            status: 2,
            userId: 2,
            shopId: 1
          },
          {
            value: "15000",
            unit: "VND",
            validFrom: new Date(),
            validUntil: addDays(new Date(), 5),
            code: "DISCOUNT#3",
            type: 2,
            status: 2,
            userId: 2,
            shopId: 1
          }
        ]);

        // await ShopDiscountService.create({
        //   shopId: 1,
        //   shopDiscountId: 1,
        //   shopServiceId: 1
        // });

        return true;
      });
    })
    .catch(err => {
      console.log(err);
      console.log("Error running seed file");
      return false;
    });
};

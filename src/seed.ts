import { sequelize } from "./connection";
import User from "./model/User";
import Role from "./model/Role";
import ShopService from "./model/ShopService";
import Shop from "./model/Shop";
import ShopDiscount from "./model/ShopDiscount";
import { addDays } from "date-fns";
import ShopDiscountService from "./model/ShopDiscountService";

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
      User.hasMany(ShopDiscount, {
        foreignKey: {
          allowNull: false
        }
      });
      ShopDiscount.belongsTo(User);

      Shop.hasMany(ShopDiscount);
      Shop.hasMany(ShopService);
      Shop.hasMany(ShopDiscountService);
      ShopDiscountService.belongsTo(Shop);

      ShopDiscount.belongsToMany(ShopService, {
        through: ShopDiscountService
      });
      ShopService.belongsToMany(ShopDiscount, {
        through: ShopDiscountService
      });

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
              password: "123456",
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
              password: "123456",
              name: "Vu",
              roleId: role.get("id")
            },
            {
              email: "khuetla@gmail.com",
              password: "123456",
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
            value: "1000",
            unit: "VND",
            validFrom: new Date(),
            validUntil: addDays(new Date(), 5),
            code: "DISCOUNT#1",
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
            status: 2,
            userId: 2,
            shopId: 1
          }
        ]);

        return true;
      });
    })
    .catch(err => {
      console.log(err);
      console.log("Error running seed file");
      return false;
    });
};

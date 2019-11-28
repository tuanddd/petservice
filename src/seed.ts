import { sequelize } from "./connection";
import User from "./model/User";
import Role from "./model/Role";
import ShopService from "./model/ShopService";
import Shop from "./model/Shop";
import ShopDiscount from "./model/ShopDiscount";
import { addDays } from "date-fns";
import ShopDiscountService from "./model/ShopDiscountService";
import VaccineVirus from "./model/VaccineVirus";
import Virus from "./model/Virus";
import Vaccine from "./model/Vaccine";
import * as csv from "neat-csv";
import { resolve } from "path";
import { readFileSync } from "fs";

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
              email: "vutnq@gmail.com",
              password: "123456",
              name: "Vu",
              roleId: role.get("id")
            }
          ]);
        });

        await Role.create({
          name: "SHOP_MANAGER"
        }).then(role => {
          User.bulkCreate([
            {
              email: "namvh@gmail.com",
              password: "123456",
              name: "Hoang Nam",
              roleId: role.get("id")
            },
            {
              email: "hoangnh@gmail.com",
              password: "123456",
              name: "Huy Hoang",
              roleId: role.get("id")
            }
          ]);
        });

        await Role.create({
          name: 'USER'
        }).then(role => {
          User.bulkCreate([
            {
              email: "tuand@gmail.com",
              name: "Dao Tuan",
              roleId: role.get("id"),
              provider: "firebase",
              providerUserId: "e3Plnk5sCYg5eNh5O9bSSBJHoKf2",
              petDataJson: '[{"pet_type_id":1,"gender":1,"birthdate":1574349685,"image":"","breed_name":"Akita","color_describe":"","pet_name":"Lucky"},{"pet_type_id":1,"gender":1,"birthdate":1574349685,"image":"","breed_name":"Pug","color_describe":"","pet_name":"suli"}]',
            },
            {
              email: "dinnlt@gmail.com",
              provider: "firebase",
              name: "Le Trach Dinh",
              providerUserId: "E6GFdFD7ZpVnVZSxEnncI2gcZBB2",
              roleId: role.get("id"),
              petDataJson: '[{"pet_type_id":1,"gender":1,"birthdate":1574349685,"image":"","breed_name":"Akita","color_describe":"","pet_name":"Bo"}]',
            },
            {
              email: "manhdv@gmail.com",
              provider: "firebase",
              name: "Dao Van Manh",
              providerUserId: "dMaTCc5xiOMeXcsMBgnHqa1JpYE3",
              roleId: role.get("id"),
              petDataJson: '[{"pet_type_id":1,"gender":1,"birthdate":1574349685,"image":"","breed_name":"Husky","color_describe":"","pet_name":"Sun"}]',
            },
            {
              email: "sontbv@gmail.com",
              provider: "firebase",
              name: "Tran Bao Van Son",
              providerUserId: "u9e7BR2e1eMu37wZvMzY4xLOPQf2",
              roleId: role.get("id"),
              petDataJson: '[{"pet_type_id":2,"gender":1,"birthdate":1574349685,"image":"","breed_name":"Egyptian Cat","color_describe":"","pet_name":"Miu"}]',
            }
          ]);

        });

        await Shop.bulkCreate([
          {
            name: "Dog Paradise",
            status: 2,
            userId: 2,
            latitude: "10.764345",
            longitude: "106.653351",
            address: "83 Tôn Thất Hiệp, Phường 13, Quận 11, TP Hồ Chí Minh",
            phoneNumber: "0796339739"
          },
          {
            name: "Pet Mart 3 tháng 2",
            status: 2,
            userId: 2,
            latitude: "10.774051",
            longitude: "106.677730",
            address: "116 3 tháng 2 , Phường 12, Quận 10, TP Hồ Chí Minh",
            phoneNumber: "0796339739"
          },
          {
            name: "AZ Pet Shop",
            status: 1,
            userId: 3,
            latitude: "10.796391",
            longitude: "106.718338",
            address: "135/11 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, Hồ Chí Minh",
            phoneNumber: "0796339739"
          }
        ]);

        await ShopService.bulkCreate([
          {
            name: "Tắm spa, vệ sinh tai",
            price: "85000",
            unit: "VND",
            shopId: 1,
            userId: 2
          },
          {
            name: "Vệ sinh tai",
            price: "1000000",
            unit: "VND",
            shopId: 2,
            userId: 2
          },
          {
            name: "Cắt lông vệ sinh",
            price: "400000",
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

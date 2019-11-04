import Shop from "../model/Shop";
import ShopDiscountService from "../model/ShopDiscountService";
import CrudService from "../class/crud-service";
import { Op } from "sequelize";

export default class ShopServiceService extends CrudService<Shop, typeof Shop> {
  model: typeof Shop;

  constructor() {
    super(Shop);
  }

  async getShopsHaveDiscountedServices(): Promise<Array<Shop>> {
    return await this.model.findAll({
      include: [
        {
          model: ShopDiscountService,
          required: true
        }
      ]
    });
  }

  async getShopLikeName(name: string, userId: number): Promise<Array<Shop>> {
    return await this.model.findAll({
      include: Object.values(this.model.associations),
      where: {
        userId,
        name: {
          [Op.like]: `%${name}%`
        }
      }
    });
  }
}

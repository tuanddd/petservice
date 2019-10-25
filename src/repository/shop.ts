import Shop from "../model/Shop";
import { IGenericRepository } from "../interface/generic-repository";
import BaseRepository from "../base/base-repository";
import ShopDiscountService from "../model/ShopDiscountService";

export default class ShopRepository extends BaseRepository<Shop, typeof Shop>
  implements IGenericRepository<Shop, typeof Shop> {
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
}

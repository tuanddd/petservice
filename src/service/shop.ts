import Shop from "../model/Shop";
import BaseService from "../base/base-service";
import ShopDiscountService from "../model/ShopDiscountService";

export default class ShopService extends BaseService<Shop, typeof Shop> {
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

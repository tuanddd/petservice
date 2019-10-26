import Shop from "../model/Shop";
import ShopDiscountService from "../model/ShopDiscountService";
import CrudService from "../class/crud-service";

export default class ShopService extends CrudService<Shop, typeof Shop> {
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

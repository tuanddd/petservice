import ShopDiscountService from "../model/ShopDiscountService";
import CrudService from "../class/crud-service";
import Shop from "../model/Shop";
import User from "../model/User";
import ShopDiscount from "../model/ShopDiscount";
import ShopService from "../model/ShopService";

export default class ShopDiscountServicesService extends CrudService<
  ShopDiscountService,
  typeof ShopDiscountService
> {
  model: typeof ShopDiscountService;

  constructor() {
    super(ShopDiscountService);
  }

  async getByUserId(userId: number): Promise<Array<ShopDiscountService>> {
    return await this.model.findAll({
      include: [
        {
          model: Shop,
          required: true,
          include: [
            {
              model: User,
              required: true,
              where: {
                id: userId
              }
            }
          ]
        },
        {
          model: ShopService,
          required: true
        },
        {
          model: ShopDiscount,
          required: true
        }
      ]
    });
  }

  async getNotAppliedByShopId(
    shopId: number
  ): Promise<{ services: Array<ShopService>; discounts: Array<ShopDiscount> }> {
    let unAppliedServices = await this.model.findAll({
      attributes: ["shop_service.id"],
      include: [
        {
          model: ShopService,
          right: true,
          required: false
        }
      ],
      where: {
        id: null,
        "$shop_service.shop_id$": shopId
      }
    });

    let unAppliedDiscounts = await this.model.findAll({
      attributes: ["shop_discount.id"],
      include: [
        {
          model: ShopDiscount,
          right: true,
          required: false
        }
      ],
      where: {
        id: null,
        "$shop_discount.shop_id$": shopId
      }
    });

    return { services: unAppliedServices, discounts: unAppliedDiscounts };
  }
}

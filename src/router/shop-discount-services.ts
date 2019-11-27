import * as express from "express";
import CrudRouter from "../class/crud-router";
import ShopDiscountService from "../model/ShopDiscountService";
import ShopDiscountServicesService from "../service/shop-discount-service";

export default class ShopDiscountServiceRouter extends CrudRouter<
  ShopDiscountService,
  typeof ShopDiscountService
  > {
  readonly service = new ShopDiscountServicesService();
  constructor() {
    super(ShopDiscountService);

    this.router.get(`/custom/get-unapplied-by-shop-id`, async (req, res) =>
      res
        .status(200)
        .json(await this.service.getNotAppliedByShopId(req.query.shopId || -1))
    );

    this.router.get(`/custom/get-active-discount-services`, async (req, res) => res.status(200).json(await this.service.getActiveDiscountServices()))

    this.router.get(
      `/custom/get-by-user-id`,
      async (req: express.Request, res: express.Response) => {
        res
          .status(200)
          .json(await this.service.getByUserId(req.query.userId || -1));
      }
    );
  }
}

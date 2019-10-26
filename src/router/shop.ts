import Shop from "../model/Shop";
import * as express from "express";
import ShopService from "../service/shop";
import CrudRouter from "../class/crud-router";

export default class ShopRouter extends CrudRouter<Shop, typeof Shop> {
  readonly service = new ShopService();
  constructor() {
    super(Shop);

    this.router.get(
      `/get-shops-have-discounted-services`,
      async (req: express.Request, res: express.Response) => {
        res
          .status(200)
          .json(await this.service.getShopsHaveDiscountedServices());
      }
    );
  }
}

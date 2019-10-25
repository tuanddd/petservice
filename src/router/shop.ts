import Shop from "../model/Shop";
import * as express from "express";
import ShopRepository from "../repository/shop";
import IGenericRouter from "../interface/generic-router";
import BaseRouter from "../base/base-router";

export default class ShopRouter extends BaseRouter<Shop, typeof Shop>
  implements IGenericRouter<Shop, typeof Shop> {
  readonly repository = new ShopRepository();
  constructor() {
    super(Shop);

    this.router.get(
      `/get-shops-have-discounted-services`,
      async (req: express.Request, res: express.Response) => {
        res
          .status(200)
          .json(await this.repository.getShopsHaveDiscountedServices());
      }
    );
  }
}

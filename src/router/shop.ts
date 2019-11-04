import Shop from "../model/Shop";
import * as express from "express";
import ShopServiceService from "../service/shop";
import CrudRouter from "../class/crud-router";

export default class ShopRouter extends CrudRouter<Shop, typeof Shop> {
  readonly service = new ShopServiceService();
  constructor() {
    super(Shop);

    this.router.get(
      `/custom/get-shops-have-discounted-services`,
      async (_req: express.Request, res: express.Response) => {
        res
          .status(200)
          .json(await this.service.getShopsHaveDiscountedServices());
      }
    );

    this.router.get(
      `/custom/search-shops-by-name`,
      async (
        req: express.Request & { userId: number },
        res: express.Response
      ) => {
        res
          .status(200)
          .json(
            await this.service.getShopLikeName(req.query.name || "", req.userId)
          );
      }
    );
  }
}

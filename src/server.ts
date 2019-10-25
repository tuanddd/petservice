import { init } from "./seed";
import * as express from "express";
import * as bodyParser from "body-parser";
import User from "./model/User";
import ShopService from "./model/ShopService";
import ShopDiscount from "./model/ShopDiscount";
import ShopDiscountService from "./model/ShopDiscountService";
import ShopRouter from "./router/shop";
import BaseRouter from "./base/base-router";
const app = express();
app.use(bodyParser.json());
const port = 5000;
init();

app.use("/api/users/", new BaseRouter(User).router);

app.use("/api/services/", new BaseRouter(ShopService).router);

app.use("/api/discounts/", new BaseRouter(ShopDiscount).router);

app.use("/api/shops/", new ShopRouter().router);

app.use(
  "/api/shop-discount-services/",
  new BaseRouter(ShopDiscountService).router
);

app.listen(port, () => {
  console.log(`Server live at ${port}`);
});

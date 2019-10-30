import { init } from "./seed";
import { config } from "dotenv";
config();
import * as express from "express";
import * as bodyParser from "body-parser";
import User from "./model/User";
import ShopService from "./model/ShopService";
import ShopDiscount from "./model/ShopDiscount";
import ShopDiscountService from "./model/ShopDiscountService";
import ShopRouter from "./router/shop";
import CrudRouter from "./class/crud-router";
import LoginRouter from "./router/login";
import * as cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;
init();

app.use("/api/users/", new CrudRouter(User).router);

app.use("/api/services/", new CrudRouter(ShopService).router);

app.use("/api/discounts/", new CrudRouter(ShopDiscount).router);

app.use("/api/shops/", new ShopRouter().router);

app.use(
  "/api/shop-discount-services/",
  new CrudRouter(ShopDiscountService).router
);

app.use(`/api/authentication/`, new LoginRouter().router);

app.listen(port, () => {
  console.log(`Server live at ${port}`);
});

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
import { verify } from "jsonwebtoken";
import * as unless from "express-unless";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;
init();

const routers: Array<{ name: string; router: express.Router }> = [
  {
    name: "users",
    router: new CrudRouter(User).router
  },
  {
    name: "services",
    router: new CrudRouter(ShopService).router
  },
  {
    name: "discounts",
    router: new CrudRouter(ShopDiscount).router
  },
  {
    name: "shops",
    router: new ShopRouter().router
  },
  {
    name: "shop-discount-services",
    router: new CrudRouter(ShopDiscountService).router
  },
  {
    name: "authentication",
    router: new LoginRouter().router
  }
];

const jwtMiddle: ((
  req: express.Request & { userId: number; token: string },
  res: express.Response,
  next: express.NextFunction
) => void) & { unless?: any } = (req, res, next) => {
  let regex = /(Bearer|bearer) (.+)/;
  let token = req.headers.authorization.match(regex)[2];
  if (token) {
    try {
      let id = (verify(token, process.env.JWT_SECRET) as unknown) as number;
      req.userId = id;
      req.token = token;
      next();
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(401).end("Unauthorized.");
  }
};

jwtMiddle.unless = unless;

app.use(
  jwtMiddle.unless({
    path: ["/api/authentication/login"]
  })
);

app.use("/api/users/", routers.find(r => r.name === "users").router);

app.use("/api/services/", routers.find(r => r.name === "services").router);

app.use("/api/discounts/", routers.find(r => r.name === "discounts").router);

app.use("/api/shops", routers.find(r => r.name === "shops").router);

app.use(
  "/api/shop-discount-services/",
  routers.find(r => r.name === "shop-discount-services").router
);

app.use(
  `/api/authentication/`,
  routers.find(r => r.name === "authentication").router
);

app.listen(port, () => {
  console.log(`Server live at ${port}`);
});

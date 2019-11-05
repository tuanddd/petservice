import { config } from "dotenv";
config();
import { init } from "./seed";
import * as fileUpload from "express-fileupload";
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
import ShopDiscountServiceRouter from "./router/shop-discount-services";
import Breed from "./model/Breed";
import BreedRouter from "./router/breed";
import Virus from "./model/Virus";
import VirusRouter from "./router/virus";
import VaccineRouter from "./router/vaccine";
import VaccineVirus from "./model/VaccineVirus";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
const port = 5000;
init();

const routers: Array<{ name: string; router: express.Router }> = [
  {
    name: "users",
    router: new CrudRouter(User).router
  },
  {
    name: "breeds",
    router: new BreedRouter().router
  },
  {
    name: "viruses",
    router: new VirusRouter().router
  },
  {
    name: "vaccines",
    router: new VaccineRouter().router
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
    router: new ShopDiscountServiceRouter().router
  },
  {
    name: "vaccine-virus",
    router: new CrudRouter(VaccineVirus).router
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
  if (!req.headers.authorization) {
    res.status(401).end("Unauthorized.");
  } else {
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
  }
};

jwtMiddle.unless = unless;

app.use(
  jwtMiddle.unless({
    path: ["/api/authentication/login", "/api/vaccines/custom/export-json"]
  })
);

app.use("/api/users/", routers.find(r => r.name === "users").router);

app.use("/api/breeds", routers.find(r => r.name === "breeds").router);

app.use("/api/viruses", routers.find(r => r.name === "viruses").router);

app.use("/api/vaccines", routers.find(r => r.name === "vaccines").router);

app.use("/api/services/", routers.find(r => r.name === "services").router);

app.use("/api/discounts/", routers.find(r => r.name === "discounts").router);

app.use("/api/shops", routers.find(r => r.name === "shops").router);

app.use(
  "/api/shop-discount-services/",
  routers.find(r => r.name === "shop-discount-services").router
);

app.use(
  "/api/vaccine-virus/",
  routers.find(r => r.name === "vaccine-virus").router
);

app.use(
  `/api/authentication/`,
  routers.find(r => r.name === "authentication").router
);

app.listen(port, () => {
  console.log(`Server live at ${port}`);
});

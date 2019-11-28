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
import { resolve } from "path";
import MedicineRouter from "./router/medicine";
import UserRouter from "./router/user";
import SuggestRouter from "./router/suggest";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static(resolve(__dirname, "./public")));
const port = 5000;
init();

const routers: Array<{ name: string; router: express.Router }> = [
  {
    name: "users",
    router: new UserRouter().router
  },
  {
    name: "breeds",
    router: new BreedRouter().router
  },
  {
    name: "medicines",
    router: new MedicineRouter().router
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
  },
  {
    name: 'suggest',
    router: new SuggestRouter().router
  }
];

const jwtMiddle: ((
  req: express.Request & { userId: number; token: string },
  res: express.Response,
  next: express.NextFunction
) => void) & { unless?: any } = (req, res, next) => {
  let APIcall = /\/api\/[\w\/\-\d]*/g;
  if (!req.path.match(APIcall)) {
    next();
  } else {
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
  }
};

jwtMiddle.unless = unless;

app.use(
  jwtMiddle.unless({
    path: [
      "/api/authentication/login",
      "/api/shops/custom/get-shops-have-discounted-services",
      "/api/shops/custom/nearby",
      "/api/shops",
      "/api/suggest/custom/get-suggestions",
      "/api/users/custom/uid",
      "/api/users/custom/firebaseUsers",
      "/api/users/custom/register-user-firebase",
      /\/api\/[\w\d\-]*\/custom\/export-json/g
    ]
  })
);

app.use("/api/users/", routers.find(r => r.name === "users").router);

app.use("/api/breeds", routers.find(r => r.name === "breeds").router);

app.use("/api/medicines", routers.find(r => r.name === "medicines").router);

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

app.use(
  `/api/suggest/`,
  routers.find(r => r.name === "suggest").router
);

app.use("/", (_req, res) =>
  res.sendFile(resolve(__dirname, "./public/index.html"))
);

app.listen(port, () => {
  console.log(`Server live at ${port}`);
});

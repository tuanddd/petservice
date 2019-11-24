import Shop from "../model/Shop";
import ShopDiscountService from "../model/ShopDiscountService";
import CrudService from "../class/crud-service";
import { Op } from "sequelize";
import { getDistance } from "geolib";
import ShopDiscount from "../model/ShopDiscount";
import Service from "../model/ShopService";
import User from "../model/User";

const MINIMUM_RADIUS = Number(process.env.NEARBY_SHOP_MINIMUM_IN_METER);
const MAXIMUM_RADIUS = Number(process.env.NEARBY_SHOP_MAXIMUM_IN_METER);

export default class ShopService extends CrudService<Shop, typeof Shop> {
  model: typeof Shop;

  constructor() {
    super(Shop);
  }

  async getShopsHaveDiscountedServices(): Promise<Array<Shop>> {
    return await this.model.findAll({
      include: [
        {
          model: User,
        },
        {
          model: ShopDiscountService,
          required: true,
          include: [
            {
              model: ShopDiscount
            },
            {
              model: Service
            }
          ]
        }
      ]
    });
  }

  // parameter r (radius is measured in meters unit)
  async getNearbyShopsBy(params: { r: string, lat: string, long: string }): Promise<Array<Shop>> {
    try {
      let { r: rQuery, lat: latQuery, long: longQuery } = params;
      if (!latQuery || !longQuery) throw new Error("Lat/Long not provided");
      const lat = parseFloat(latQuery), lon = parseFloat(longQuery);
      let r = parseInt(rQuery, 10);
      if (isNaN(r)) throw new Error("Invalid radius");
      if (r > MAXIMUM_RADIUS) r = MAXIMUM_RADIUS;
      if (r < MINIMUM_RADIUS) r = MINIMUM_RADIUS;
      if (isNaN(lat) || isNaN(lon)) throw new Error(`Invalid Lat: ${latQuery}, Long: ${longQuery}`);
      const shops = await this.model.findAll();
      let isNear: (shop: { latitude: string, longitude: string } & Shop) => boolean = ({ latitude, longitude }) => {
        const sLat = parseFloat(latitude);
        const sLon = parseFloat(longitude);
        return !isNaN(sLat) && !isNaN(sLon) && getDistance({ lat, lon }, { lat: sLat, lon: sLon }) <= r;
      };
      return shops.filter(isNear)
    } catch (error) {
      console.error(error);
      return Promise.resolve([])
    }
  }

  async getShopLikeName(name: string, userId: number): Promise<Array<Shop>> {
    return await this.model.findAll({
      include: Object.values(this.model.associations),
      where: {
        userId,
        name: {
          [Op.like]: `%${name}%`
        }
      }
    });
  }
}

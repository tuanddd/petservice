import Shop from "../model/Shop";
import ShopDiscountService from "../model/ShopDiscountService";
import CrudService from "../class/crud-service";
import { Op } from "sequelize";
import { getDistance } from "geolib";

export default class ShopService extends CrudService<Shop, typeof Shop> {
  model: typeof Shop;

  constructor() {
    super(Shop);
  }

  async getShopsHaveDiscountedServices(): Promise<Array<Shop>> {
    return await this.model.findAll({
      include: [
        {
          model: ShopDiscountService,
          required: true
        }
      ]
    });
  }

  async getNearbyShopsBy(params: { r: string, numOfShops: string, lat: string, long: string }): Promise<Array<Shop>> {
    try {
      const maximumRadius = 100, minimumRadius = 5;
      let { r: rQuery, numOfShops = 5, lat: latQuery, long: longQuery } = params;
      if (!latQuery || !longQuery) throw new Error("Lat/Long not provided");
      const lat = parseFloat(latQuery), lon = parseFloat(longQuery);
      let r = parseInt(rQuery, 10);
      if (isNaN(r)) throw new Error("Invalid radius");
      if (r > maximumRadius) r = maximumRadius;
      if (r < minimumRadius) r = minimumRadius;
      if (isNaN(lat) || isNaN(lon)) throw new Error(`Invalid Lat: ${latQuery}, Long: ${longQuery}`);
      const shops = await this.model.findAll();
      let isNear: (shop: { latitude: string, longtitude: string } & Shop) => boolean = ({ latitude, longtitude }) => {
        const sLat = parseFloat(latitude);
        const sLon = parseFloat(longtitude);
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

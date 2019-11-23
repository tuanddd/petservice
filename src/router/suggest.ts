import BaseRouter from "../class/base-router";
import User from "../model/User";
import SuggestService from "../service/suggest";

export default class SuggestRouter extends BaseRouter<User, typeof User> {
  readonly service = new SuggestService()

  constructor() {
    super()

    this.router.get(`/custom/get-suggestions`, async (req, res) => {
      let { firebaseUid } = req.query;
      res.status(200).json(await this.service.computeSuggestList(firebaseUid))
    })
  }
}
import { Model } from "sequelize";
import { GenericStaticType, IBaseService } from "../interface/base-service";

export default class BaseService<
  E extends Model,
  M extends GenericStaticType<E>
> implements IBaseService<E, M> {
  constructor(public model: M) {}

  async getAll(): Promise<Array<E>> {
    return await this.model.findAll({
      include: Object.values(this.model.associations)
    });
  }

  async getOne(id: number): Promise<E | null> {
    return await this.model.findOne({
      where: { id },
      include: Object.values(this.model.associations)
    });
  }

  async create(user: E): Promise<E> {
    return await this.model.create(user, {
      include: Object.values(this.model.associations)
    });
  }

  async edit(user: { id: number }): Promise<E> {
    let entity: E = (await this.getOne(user.id)) as E;
    if (entity) {
      Object.entries(user).forEach(entry => {
        let key = entry[0];
        let value = entry[1];
        if (key === "id") return;
        entity.set(key as keyof E, (value as unknown) as E[keyof E]);
      });

      let updated = (this.getOne((await entity.save()).get(
        "id"
      ) as number) as unknown) as E;

      return new Promise((resolve, _reject) => {
        resolve(updated);
      });
    } else {
      return new Promise((resolve, _reject) => resolve(entity));
    }
  }

  async remove(id: number): Promise<number> {
    return await this.model.destroy({ where: { id } });
  }
}
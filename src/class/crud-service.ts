import { Model, WhereOptions } from "sequelize/types";
import { GenericStaticType } from "../interface/base-service-newfile";
import { ICrudService } from "../interface/crud-service";
import BaseService from "./base-service";

export default class CrudService<
  E extends Model,
  M extends GenericStaticType<E>
  > extends BaseService<E, M> implements ICrudService<E, M> {
  async getAll(params?: WhereOptions): Promise<Array<E>> {
    return await this.model.findAll({
      where: params,
      include: Object.values(this.model.associations)
    });
  }

  async getOne(id: number): Promise<E | null> {
    return await this.model.findOne({
      where: { id },
      include: Object.values(this.model.associations)
    });
  }

  async create(model: E): Promise<E> {
    return await this.model.create(model, {
      include: Object.values(this.model.associations)
    });
  }

  async createBulk(models: Array<E>): Promise<Array<E>> {
    return await this.model.bulkCreate(models, {
      include: Object.values(this.model.associations)
    });
  }

  async edit(model: { id: number }): Promise<E> {
    let entity: E = (await this.getOne(model.id)) as E;
    if (entity) {
      Object.entries(model).forEach(entry => {
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

  async removeByParams(params: WhereOptions): Promise<number> {
    return await this.model.destroy({ where: params });
  }
}

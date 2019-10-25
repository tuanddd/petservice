import GenericRepository from "../generic-repository";
import { Model } from "sequelize/types";
import {
  GenericStaticType,
  IGenericRepository
} from "../interface/generic-repository";

export default class BaseRepository<
  E extends Model,
  M extends GenericStaticType<E>
> extends GenericRepository<E, M> implements IGenericRepository<E, M> {}

import BaseService from "../class/base-service";
import User from "../model/User";
import { intersection, uniqWith, sortBy, reverse, difference } from "lodash";

enum PET_TYPE {
  DOG = 1,
  CAT,
  OTHER
}

type PetData = {
  type: PET_TYPE,
  breedName: string
}

type TransformedUser = {
  id: number
  name?: string
  email: string
  similarityScoreForPetType: number
  similarityScoreForBreedType: number
  totalSimilarityScore: number
  petData: Array<PetData>
}

export default class SuggestService extends BaseService<User, typeof User> {
  constructor() {
    super(User)
  }

  async computeSuggestList(id: number): Promise<Array<TransformedUser>> {
    try {
      // START: INIT + TRANSFORM
      const allUsers = await this.model.findAll();
      const transformed: Array<TransformedUser> = allUsers.map(user => {
        const parsedJson = JSON.parse(user.petDataJson);
        return {
          id: user.id, name: user.name, email: user.email, similarityScoreForPetType: 0, similarityScoreForBreedType: 0, totalSimilarityScore: 0, petData: parsedJson.map((p: { pet_type_id: any; breed_name: any; }) => {
            const { pet_type_id, breed_name } = p;
            return {
              type: pet_type_id === 1 ? PET_TYPE.DOG : pet_type_id === 2 ? PET_TYPE.CAT : PET_TYPE.OTHER,
              breedName: breed_name
            }
          })
        }
      })
      // END: INIT + TRANSFORM

      // START: CLEAN DUPS
      const clean = transformed.map(t => {
        return { ...t, petData: uniqWith(t.petData, (a, b) => a.breedName === b.breedName && a.type === b.type) }
      })
      // END: CLEAN DUPS

      const user = clean.find(t => t.id === id);
      if (!user) return Promise.resolve([]);
      const others = clean.filter(t => t.id !== id)



      // START: 1ST LAYER SIMILARITY (PET TYPE)
      const firstLayer = others.map(o => {
        const userPetType = user.petData.map(p => p.type);
        const otherPetType = o.petData.map(p => p.type);


        const p = intersection(userPetType, otherPetType).length;
        const q = difference(userPetType, otherPetType).length;
        const r = difference(otherPetType, userPetType).length;

        return { ...o, similarityScoreForPetType: (p / (p + r + q)) }
      }).filter(fl => fl.similarityScoreForPetType > 0);
      // END: 1ST LAYER SIMILARITY (PET TYPE)



      // START: 2ND LAYER SIMILARITY (BREED TYPE)
      const secondLayer = firstLayer.map(o => {
        const userBreedType = user.petData.map(p => p.breedName);
        const otherBreedType = o.petData.map(p => p.breedName);


        const p = intersection(userBreedType, otherBreedType).length;
        const q = difference(userBreedType, otherBreedType).length;
        const r = difference(otherBreedType, userBreedType).length;

        return { ...o, similarityScoreForBreedType: (p / (p + r + q)) }
      })
      // END: 2NDD LAYER SIMILARITY (BREED TYPE)



      // SUM AND SORT ASC AND REVERSE TO DESC
      const result = reverse(sortBy(secondLayer.map(sl => ({ ...sl, totalSimilarityScore: sl.similarityScoreForBreedType + sl.similarityScoreForPetType })), sl => sl.totalSimilarityScore))

      return result;

    } catch (error) {
      return Promise.resolve([])
    }
  }
}
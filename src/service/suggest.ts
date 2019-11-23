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
  providerUserId: string
  similarityScoreForPetType: number
  similarityScoreForBreedType: number
  totalSimilarityScore: number
  petData: Array<PetData>
}

export default class SuggestService extends BaseService<User, typeof User> {
  constructor() {
    super(User)
  }

  async computeSuggestList(id: string): Promise<Array<TransformedUser>> {
    try {
      // START: INIT + TRANSFORM
      const allUsers = await this.model.findAll();

      const filterUsers = allUsers.filter(user => {
        return user.provider === 'firebase' || user.petDataJson !== '';
      })

      const transformed: Array<TransformedUser> = filterUsers.map(user => {
          const parsedJson = JSON.parse(user.petDataJson);
          return {
            id: user.id, name: user.name, email: user.email, providerUserId: user.providerUserId, similarityScoreForPetType: 0, similarityScoreForBreedType: 0, totalSimilarityScore: 0, petData: parsedJson.map((p: { pet_type_id: any; breed_name: any; }) => {
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
      console.log(clean);
      // END: CLEAN DUPS

      const user = clean.find(t => t.providerUserId === id);

      console.log(id);
      console.log(user);
      if (!user) return Promise.resolve([]);

      const others = clean.filter(t => t.providerUserId !== id)

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

      console.log(firstLayer);

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
      console.log(error);
      return Promise.resolve([])
    }
  }
}
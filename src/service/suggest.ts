import BaseService from "../class/base-service";
import User from "../model/User";
import { intersection, union, sortBy, reverse } from "lodash";

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
  id: number,
  name?: string,
  email: string,
  similarityScore: number
  petData: Array<PetData>,
}

export default class SuggestService extends BaseService<User, typeof User> {
  constructor() {
    super(User)
  }

  async computeSuggestList(id: number): Promise<Array<TransformedUser>> {
    try {
      const allUsers = await this.model.findAll();
      const transformed: Array<TransformedUser> = allUsers.map(user => {
        const parsedJson = JSON.parse(user.petDataJson);
        return {
          id: user.id, name: user.name, email: user.email, similarityScore: 0, petData: parsedJson.map((p: { pet_type_id: any; breed_name: any; }) => {
            const { pet_type_id, breed_name } = p;
            return {
              type: pet_type_id === 1 ? PET_TYPE.DOG : pet_type_id === 2 ? PET_TYPE.CAT : PET_TYPE.OTHER,
              breedName: breed_name
            }
          })
        }
      })


      const user = transformed.find(t => t.id === id);
      if (!user) return Promise.resolve([]);

      const others = transformed.filter(t => {
        const notSelf = t.id !== id;
        const matchPetType = intersection(user.petData.map(p => p.type), t.petData.map(p => p.type)).length > 0
        return notSelf && matchPetType
      });

      const calculated = others.map(o => {
        // number of matching breed
        const i = intersection(user.petData.map(p => p.breedName), o.petData.map(p => p.breedName)).length

        // number of total breeds there are between these two
        const u = union(user.petData.map(p => p.breedName), o.petData.map(p => p.breedName)).length;

        return { ...o, similarityScore: i / u }
      })

      const sortedAndReversed = reverse(sortBy(calculated, o => o.similarityScore));

      return sortedAndReversed


    } catch (error) {
      return Promise.resolve([])
    }
  }
}
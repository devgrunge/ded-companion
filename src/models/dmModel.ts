import { DmData } from "../routes/types/routeTypes";

export class DmModel {
  async list(search: string | undefined) {
    console.log(search);
  }
  async create(dm_name: DmData) {

  }
  async update(dmId: string | unknown, dmData: object) {

  }
  async delete(dmId: string | unknown) {

  }
}

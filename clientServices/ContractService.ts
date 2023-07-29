import api from "@/http";
import { IInfo } from "@/interface/iContact";

export default class ContractService {
  static async addContract(info: IInfo) {
    return api.post("/api/createcontract", {
      info,
    });
  }
  static async getContract(id: string) {
    return api.post("/api/getcontract", {
      id,
    });
  }
  static async getAllContract() {
    return api.get("/api/getallcontract");
  }
  static async createContract(id: string) {
    return api.post("/api/doc/saveonbd", {
      id,
    });
  }
}

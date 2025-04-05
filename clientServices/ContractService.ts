import api from "@/http";
import { IContract, IInfo } from "@/interface/iContact";

export default class ContractService {
  static async addContract(info: IInfo) {
    return api.post("/api/createcontract", {
      info,
    });
  }
  static async senContractToParent(id: string) {
    return api.post("/api/doc/sendcontracttoparent", {
      id,
    });
  }
  static async senContractToAdmin(id: string) {
    return api.post("/api/doc/sendcontracttoadmin", {
      id,
    });
  }
  static async changeContract(info: IContract) {
    return api.post("/api/changecontract", {
      info,
    });
  }
  static async getContract(id: string) {
    return api.post("/api/getcontract", {
      id,
    });
  }
  static async deleteContract(id: string) {
    return api.post("/api/returncontract", {
      id,
    });
  }
  static async getAllContract() {
    return api.get("/api/getallcontract");
  }
  static async unsetContract() {
    return api.post("/api/getallcontract");
  }
  static async createContract(id: string) {
    return api.post("/api/doc/saveonbd", {
      id,
    });
  }
  static async checkBirthday() {
    return api.get("/api/sendmailer");
  }
}

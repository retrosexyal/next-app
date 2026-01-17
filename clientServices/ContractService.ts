import api from "@/http";
import { IContract, IInfo } from "@/interface/iContact";

export default class ContractService {
  static async addContract(info: IContract) {
    return api.post("/api/createcontract", {
      info,
    });
  }
  static async senContractToParent({
    userId,
    contractId,
  }: {
    userId: string;
    contractId: string;
  }) {
    return api.post("/api/doc/sendcontracttoparent", {
      userId,
      contractId,
    });
  }
  static async senContractToAdmin({
    userId,
    contractId,
  }: {
    userId: string;
    contractId: string;
  }) {
    return api.post("/api/doc/sendcontracttoadmin", {
      userId,
      contractId,
    });
  }
  static async changeContract(info: IContract) {
    return api.post("/api/changecontract", {
      info,
    });
  }
  static async getContract(id: string, isAllContract?: boolean) {
    return api.post("/api/getcontract", {
      id,
      isAllContract,
    });
  }
  static async deleteContract({
    userId,
    contractId,
  }: {
    userId: string;
    contractId: string;
  }) {
    return api.post("/api/returncontract", {
      userId,
      contractId,
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

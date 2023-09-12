import { IContract, IInfo } from "@/interface/iContact";
import contractModel from "@/models/contract-model";
import shablonModel from "@/models/shablon-model";
import userModel from "@/models/user-model";

class ContractService {
  async createContract(userId: string, info: IInfo) {
    const test = await contractModel.findOne({ user: userId });

    if (test) {
      throw new Error(`договор у ${userId} уже существует`, { cause: test });
    }
    const contract = await contractModel.create({
      user: userId,
      parentName: info.FIOP,
      childrenName: info.FIOC,
      diseases: info.desiases,
      birthday: info.dateB,
      place: info.place,
      KB: info.KB,
      pasportDate: info.datePass,
      pasportPlace: info.whoPass,
      phone: info.phone,
    });
    try {
      const user = await userModel.findById(userId);
      console.log(user);
      user.status = "send";
      await user.save();
    } catch (e) {
      console.log(e);
    }
    return contract;
  }
  async getContract(userId: string) {
    const contract = await contractModel.findOne({ user: userId });
    if (contract) {
      return contract;
    }
    return { message: "информацию отсутствует" };
  }
  async getAllContract() {
    const contract = await contractModel.find();
    if (contract) {
      return contract;
    }
    return { message: "информацию отсутствует" };
  }
  async deleteContract(userId: string) {
    const contractData = await contractModel.deleteOne({ user: userId });
    try {
      const user = await userModel.findById(userId);
      console.log(user);
      user.status = "";
      await user.save();
    } catch (e) {
      console.log(e);
    }

    return contractData;
  }
  async updateContract(userId: string) {
    const contract = await contractModel.findOne({ user: userId });
    if (contract) {
      contract.isDone = true;
      contract.save();
      return contract;
    }
    return { message: "информацию отсутствует" };
  }
  async getNumberContract() {
    const number = await shablonModel.findOne({ name: "Dogovor" });
    return number.number;
  }
  async setNumberContract() {
    const number = await shablonModel.findOne({ name: "Dogovor" });
    number.number++;
    number.save();
    return number;
  }
}
export const contractService = new ContractService();

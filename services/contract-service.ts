import { IContract, IInfo } from "@/interface/iContact";
import contractModel from "@/models/contract-model";
import shablonModel from "@/models/shablon-model";
import userModel from "@/models/user-model";
import { status } from "@/constants/constants";

class ContractService {
  async createContract(userId: string, info: IInfo) {
    const test = await contractModel.findOne({ user: userId });

    if (test) {
      test.parentName = info.FIOP;
      test.childrenName = info.FIOC;
      test.diseases = info.desiases;
      test.birthday = info.dateB;
      test.place = info.place;
      test.KB = info.KB;
      test.pasportDate = info.datePass;
      test.pasportPlace = info.whoPass;
      test.phone = info.phone;
      test.isOldContract = false;
      test.isSend = true;
      await test.save();
      /* throw new Error(`договор у ${userId} уже существует`, { cause: test }); */
      try {
        const user = await userModel.findById(userId);
        user.status = status.SEND;
        await user.save();
      } catch (e) {
        console.log(e);
      }
      return test;
    } else {
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
        isSend: true,
      });
      try {
        const user = await userModel.findById(userId);
        user.status = status.SEND;
        await user.save();
      } catch (e) {
        console.log(e);
      }
      return contract;
    }
    /* try {
      const user = await userModel.findById(userId);
      user.status = "send";
      await user.save();
    } catch (e) {
      console.log(e);
    } */
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
    /* const contractData = await contractModel.deleteOne({ user: userId }); */
    const contractData = await contractModel.findOne({ user: userId });
    try {
      const user = await userModel.findById(userId);
      user.status = status.RETURNED;
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
  async changeContract() {
    const result = await contractModel.updateMany({}, { isOldContract: true });

    if (result) {
      console.log(result);

      return { message: "Информация обновлена" };
    }
    return { message: "Информация отсутствует" };
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

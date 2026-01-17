import { IContract, IInfo } from "@/interface/iContact";
import contractModel from "@/models/contract-model";
import shablonModel from "@/models/shablon-model";
import userModel from "@/models/user-model";
import { status } from "@/constants/constants";
import { formattedDate } from "@/helpers/helpers";

class ContractService {
  async createContract(userId: string, info: IContract) {
    const contractId = info["_id"];

    console.log(contractId);

    if (contractId) {
      const test = await contractModel.findOne({ _id: contractId });

      if (!test) {
        throw new Error("Contract not found");
      }
      test.parentName = info.parentName;
      test.childrenName = info.childrenName;
      test.diseases = info.diseases;
      test.birthday = formattedDate(info.birthday);
      test.place = info.place;
      test.KB = info.KB;
      test.pasportDate = info.pasportDate;
      test.pasportPlace = info.pasportPlace;
      test.phone = info.phone;
      test.isOldContract = false;
      test.isSend = true;
      test.address = info.address;
      test.sex = info.sex;
      await test.save();

      return test;
    }

    try {
      const { _id, ...newData } = info;
      const contract = await contractModel.create({
        ...newData,
        isSend: true,
        user: userId,
        birthday: formattedDate(info.birthday),
      });

      return contract;
    } catch (e) {
      console.log(e);
    }
  }
  async getContract(contractId: string) {
    const contract = await contractModel.findOne({ _id: contractId });
    if (contract) {
      return contract;
    }
    return { message: "информацию отсутствует" };
  }
  async getAllUserContract(userId: string) {
    const contract = await contractModel.find({ user: userId });
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
  async deleteContract({
    userId,
    contractId,
  }: {
    userId: string;
    contractId: string;
  }) {
    /* todo сделать удаление */
    /* const contractData = await contractModel.deleteOne({ user: userId }); */
    const contractData = await contractModel.findOne({ _id: contractId });

    try {
      const user = await userModel.findById(userId);
      user.status = "";
      contractData.isSend = false;
      await user.save();
      await contractData.save();
    } catch (e) {
      console.log(e);
    }

    return contractData;
  }
  async returnContract(userId: string) {
    /* const contractData = await contractModel.deleteOne({ user: userId }); */
    const contractData = await contractModel.findOne({ user: userId });
    try {
      const user = await userModel.findById(userId);
      user.status = "";
      contractData.isSend = false;
      await user.save();
      await contractData.save();
    } catch (e) {
      console.log(e);
    }

    return contractData;
  }
  async updateContract(contractId: string) {
    const contract = await contractModel.findOne({ _id: contractId });
    if (contract) {
      contract.isDone = true;
      await contract.save();
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

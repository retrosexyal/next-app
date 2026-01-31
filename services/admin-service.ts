import StudentModel from "@/models/student-model";
import messageModel from "@/models/message-model";
import { IGroup } from "@/clientModels/IGroup";
import GroupModels from "@/models/group-model";
import userModel from "@/models/user-model";
import contractModel from "@/models/contract-model";

class AdminService {
  async addStudent(name: string, date: string, place: string, group: string) {
    const canditate = await StudentModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (canditate) {
      throw new Error(`такой ребенок уже есть в списке`);
    }

    const student = await StudentModel.create({
      name,
      date,
      place,
      group,
    });

    return {
      student,
    };
  }

  async createGroup({ name, students }: IGroup) {
    const candidate = await GroupModels.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (candidate) {
      throw new Error(`группа уже имеется`);
    }

    const group = await GroupModels.create({
      name,
      students,
    });

    return {
      group,
    };
  }
  async deleteStudent(id: string) {
    const candidate = await StudentModel.findByIdAndDelete(id);
    if (!candidate) {
      throw new Error(`Ребенок с именем ${id} не найден`);
    }
    return {
      message: `Ребенок с ID ${id} успешно удален из списка`,
    };
  }

  async changeStudent(
    id: string,
    name: string,
    place: string,
    date: string,
    group: string
  ) {
    const candidate = await StudentModel.findById(id);
    if (!candidate) {
      throw new Error(`Ребенок с именем ${id} не найден`);
    }
    candidate.name = name || candidate.name;
    candidate.place = place || candidate.place;
    candidate.date = date || candidate.date;
    candidate.group = group || candidate.group;
    candidate.save();
    return {
      candidate,
    };
  }

  async getAllStudents() {
    const students = await StudentModel.find();
    return students;
  }

  async getStudent(id: string) {
    const candidate = await StudentModel.findById(id);
    if (!candidate) {
      throw new Error(`Ребенок с именем ${id} не найден`);
    }
    return candidate;
  }
  async sendMessage(id: string, message: string) {
    const user = await messageModel.findOne({ user: id });
    if (!user) {
      const createdMessage = await messageModel.create({
        user: id,
        message: message,
      });
      return createdMessage;
    }
    user.message = message;
    await user.save();
    return user;
  }

  async resetAllContractsAndUsers() {
    try {
      await userModel.updateMany({}, { $set: { status: "" } });
      await contractModel.updateMany(
        {},
        { $set: { isSend: false, isDone: false } }
      );

      return { success: true };
    } catch (e) {
      console.error(e);
      throw new Error("Ошибка при массовом обновлении");
    }
  }
}

export const adminService = new AdminService();

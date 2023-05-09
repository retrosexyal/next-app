import StudentModel from "@/models/student-model";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { tokenService } from "./token-service";
import UserDto from "@/dtos/user-dto";

interface UserModel {
  email: string;
  id: string;
  isActivated: boolean;
}

class AdminService {
  async addStudent(name: string, date: string, place: string, mentor?: string) {
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
      mentor,
    });

    return {
      student,
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
}

export const adminService = new AdminService();

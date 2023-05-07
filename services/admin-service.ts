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
  /* async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(`пользователь с почтовым ящиком ${email} не существует`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new Error(`пароль не верен`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("ошибка обновления токена");
    }
    const userData = tokenService.validateRefreshToken(
      refreshToken
    ) as UserModel;
    const tokenFromDb = tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new Error("ошибка обновления токена");
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  } */
}

export const adminService = new AdminService();

import UserModel from "@/models/user-model";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { tokenService } from "./token-service";
import UserDto from "@/dtos/user-dto";

interface UserModel {
  email: string;
  id: string;
  isActivated: boolean;
}

class UserService {
  async registration(email: string, password: string) {
    const canditate = await UserModel.findOne({ email });
    if (canditate) {
      throw new Error(`пользователь с почтовым ящиком ${email} существует`);
    }
    const hashPassword = await bcrypt.hash(password, 7);

    const activationLink = v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    // сделать отправку письма на почту
    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email: string, password: string) {
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
  }
}

export const userService = new UserService();

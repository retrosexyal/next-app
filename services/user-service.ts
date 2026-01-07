import UserModel from "@/models/user-model";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { tokenService } from "./token-service";
import UserDto from "@/dtos/user-dto";
import { mailOptionsRegist, transporter } from "@/config/nodemailer";
import { env } from "process";
import messageModel from "@/models/message-model";

const URL = env.URL;

interface UserModel {
  email: string;
  id: string;
  isActivated: boolean;
}

class UserService {
  async registration(email: string, password: string, name: string) {
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
      name,
      isActivated: false,
      status: "",
    });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    await transporter.sendMail({
      ...mailOptionsRegist(email),
      subject: "Активация аккаунта ЛиМи",
      text: "_",
      html: `<h1> для активации пройдите по <a href='${URL}api/activate/${activationLink}'>ссылке</a></h2>`,
    });
    return {
      ...tokens,
      user: userDto,
    };
  }
  async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(`пользователь с почтовым ящиком ${email} не существует`);
    }

    await transporter.sendMail({
      ...mailOptionsRegist(email),
      subject: "Восстановление пароля",
      text: "Вы запросили восстановление пароля. Проверьте письмо в HTML-формате.",
      html: `
  <div style="
    max-width:600px;
    margin:0 auto;
    padding:24px;
    font-family:Arial, Helvetica, sans-serif;
    background-color:#f9fafb;
    color:#111827;
  ">
    <div style="
      background:#ffffff;
      border-radius:12px;
      padding:32px;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">

      <h1 style="margin-top:0; color:#111827;">
        🔐 Восстановление пароля
      </h1>

      <p style="font-size:16px; line-height:1.5;">
        Вы получили это письмо, потому что был отправлен запрос на восстановление пароля
        для вашей учётной записи.
      </p>

      <h3 style="margin-top:28px;">
        Что нужно сделать:
      </h3>

      <ol style="font-size:16px; line-height:1.6;">
        <li>Нажмите на кнопку ниже</li>
        <li>Вы будете перенаправлены на страницу входа</li>
        <li>Используйте временный пароль из этого письма</li>
        <li>После входа обязательно смените пароль</li>
      </ol>

      <div style="text-align:center; margin:32px 0;">
        <a
          href="${URL}api/forgotpass/refresh/${user.activationLink}"
          style="
            display:inline-block;
            padding:14px 28px;
            background-color:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:8px;
            font-size:16px;
            font-weight:bold;
          "
        >
          Сбросить пароль
        </a>
      </div>

      <p style="font-size:16px;">
        <strong>Ваш временный пароль:</strong>
      </p>

      <div style="
        background:#f3f4f6;
        border-radius:8px;
        padding:16px;
        text-align:center;
        font-size:28px;
        font-weight:bold;
        letter-spacing:2px;
        color:#dc2626;
        margin-bottom:24px;
      ">
        ${user.activationLink.split("-")[0]}
      </div>

      <p style="font-size:14px; color:#6b7280;">
        Если вы не запрашивали восстановление пароля — просто проигнорируйте это письмо.
        Ваш аккаунт останется в безопасности.
      </p>

      <hr style="margin:32px 0; border:none; border-top:1px solid #e5e7eb;" />

      <p style="font-size:12px; color:#9ca3af;">
        Это письмо создано автоматически. Пожалуйста, не отвечайте на него.
      </p>

    </div>
  </div>
  `,
    });

    return { message: "сообщение отправлено" };
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

  async changePass(email: string, password: string, newPassword: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(`пользователь с почтовым ящиком ${email} не существует`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new Error(`пароль не верен`);
    }
    const newPass = await bcrypt.hash(newPassword, 7);
    user.password = newPass;
    await user.save();
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

  async getUser(id: string) {
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      throw new Error(`пользователь не существует`);
    }
    return user;
  }
  async getMessage(id: string) {
    const message = await messageModel.findOne({ user: id });
    return message || "";
  }
}

export const userService = new UserService();

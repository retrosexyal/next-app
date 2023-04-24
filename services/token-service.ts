import jwt from "jsonwebtoken";
import tokenModel from "@/models/token-model";
import { env } from "process";

interface UserModel {
  email: string;
  id: string;
  isActivated: boolean;
}

const accessKey = env.ACCESS_TOKEN_KEY || "123";
const refreshKey = env.REFRESH_TOKEN_KEY || "1234";

class TokenService {
  generateToken(payload: UserModel) {
    const accessToken = jwt.sign(payload, accessKey, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, refreshKey, { expiresIn: "30d" });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, accessKey);
      return userData;
    } catch (error) {
      return null;
    }
  }
  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, refreshKey);
      return userData;
    } catch (error) {
      return null;
    }
  }
  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
  async removeToken(refreshToken: string) {
    const tokenData = tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }
  async findToken(refreshToken: string) {
    const tokenData = tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

export const tokenService = new TokenService();

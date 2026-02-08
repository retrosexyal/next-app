import { IUser } from "@/clientModels/IUser";
import { tokenService } from "@/services/token-service";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Group from "@/models/group-model";
import { env } from "process";
import { NextRequest } from "next/server";

export const ADMINS = ["admin@admin"];

export const TEACHERS = ["liza@limi.by", "alesia@limi.by", "admin@admin"];

export const checkAdmin = (req: NextApiRequest) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (accessToken) {
    const token = tokenService.validateAccessToken(accessToken!) as IUser;
    if (token.email === "admin@admin") {
      return true;
    }
    return false;
  }
};

export const returnNotAdmin = ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  if (!checkAdmin(req)) {
    res.status(401).json("не админ");
  }
};
export const getUserInfo = (req: NextApiRequest) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (accessToken) {
    const token = tokenService.validateAccessToken(accessToken!) as IUser;
    return token;
  }
};

export const getUserFromReq = (req: NextApiRequest) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return null;
  return tokenService.validateAccessToken(token) as IUser;
};

export const getUserFromReqProxy = (req: NextRequest) => {
  const token = req.cookies.get("refreshToken")?.value;

  if (!token) return null;
  return tokenService.validateRefreshToken(token) as IUser;
};

export const requireAdmin = ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const user = getUserFromReq(req);
  if (!user || !ADMINS.includes(user.email)) {
    res.status(403).json("нет доступа");
    return null;
  }
  return user;
};

export const requireTeacher = ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const user = getUserFromReq(req);
  if (
    !user ||
    (!TEACHERS.includes(user.email) && !ADMINS.includes(user.email))
  ) {
    res.status(403).json("нет доступа");
    return null;
  }
  return user;
};

export const getCurrentDate = () => {
  const timezoneOffset = 180; // Смещение временной зоны в минутах (180 минут = GMT+3)

  // Получаем текущую дату и время по минскому времени
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + timezoneOffset);

  // Извлекаем день, месяц и год
  const day = currentTime.getDate();
  const month = currentTime.getMonth() + 1; // Месяцы в объекте Date нумеруются с нуля, поэтому добавляем 1
  const year = currentTime.getFullYear();

  // Форматируем дату в нужном нам формате
  const formattedDate = `${day < 10 ? "0" + day : day}.${
    month < 10 ? "0" + month : month
  }.${year}`;

  return formattedDate;
};
//2024-03-23
export const formattedDate = (date: string) => {
  const dateArr = date.split("-");
  if (dateArr.length < 2) {
    return date;
  }
  return `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`;
};

export function generateRandomAlphaNumeric(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
const MONGODB_URI = env.DB_URL as string;
/* const MONGODB_URI = process.env.DB_URL as string; */

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// @ts-ignore
let cached: MongooseGlobal = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async (): Promise<typeof mongoose> => {
  if (!MONGODB_URI) {
    throw new Error("DB_URL is not defined");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export const requireGroupAccess = async (
  groupId: string,
  user: IUser,
  res: NextApiResponse,
) => {
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404).json("группа не найдена");
    return null;
  }

  const isAdmin = ADMINS.includes(user.email);
  if (!isAdmin && group.ownerEmail !== user.email) {
    res.status(403).json("нет доступа к группе");
    return null;
  }

  return group;
};

export function startOfMoscowDay(date = new Date()) {
  const utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );

  return new Date(utc);
}

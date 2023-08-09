import { IUser } from "@/clientModels/IUser";
import { tokenService } from "@/services/token-service";
import { NextApiRequest } from "next";

export const checkAdmin = (req: NextApiRequest) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (accessToken) {
    const token = tokenService.validateAccessToken(accessToken!) as IUser;
    if (token.email === "admin@admin") {
      console.log(token);
      return true;
    }
    return false;
  }
};
export const getUserInfo = (req: NextApiRequest) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (accessToken) {
    const token = tokenService.validateAccessToken(accessToken!) as IUser;
    return token;
  }
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

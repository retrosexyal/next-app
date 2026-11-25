import { IUser } from "../IUser";

export interface AuthResponce {
  accessToken: string;
  user: IUser;
}

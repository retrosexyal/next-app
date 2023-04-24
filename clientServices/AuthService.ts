import { AuthResponce } from "@/clientModels/responce/AuthResponce";
import api from "@/http";
import { AxiosResponse } from "axios";
export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponce>> {
    return api.post<AuthResponce>("/api/login", { email, password });
  }
  static async registration(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponce>> {
    return api.post<AuthResponce>("/api/registration", { email, password });
  }
  static async logout(): Promise<void> {
    return api.post("/api/logout");
  }
}

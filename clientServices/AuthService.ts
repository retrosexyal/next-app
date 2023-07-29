import { AuthResponce } from "@/clientModels/responce/AuthResponce";
import api from "@/http";
import { IInfo } from "@/interface/iContact";
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
    password: string,
    name: string
  ): Promise<AxiosResponse<AuthResponce>> {
    return api.post<AuthResponce>("/api/registration", {
      email,
      password,
      name,
    });
  }
  static async logout(): Promise<void> {
    return api.post("/api/logout");
  }
  static async getStudents() {
    return api.get("/api/getstudent");
  }
  static async refresh() {
    return api.get<AuthResponce>("/api/refresh");
  }
  static async addStudent(
    name: string,
    date: string,
    place: string,
    group: string
  ) {
    return api.post<AuthResponce>("/api/addstudent", {
      name,
      date,
      place,
      group,
    });
  }
  static async changeStudent(
    id: string,
    name: string,
    place: string,
    date: string,
    group: string
  ) {
    return api.post<AuthResponce>("/api/changestudent", {
      id,
      name,
      place,
      date,
      group,
    });
  }
  static async deleteStudent(id: string) {
    return api.post<AuthResponce>("/api/deletestudent", { id });
  }
  static async registerForm(info: IInfo) {
    return api.post("/api/registermail", { info });
  }
}

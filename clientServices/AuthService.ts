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
  static async getStudents() {
    return api.get("/api/getstudent");
  }
  static async addStudent(name: string, date: string, place: string) {
    return api.post<AuthResponce>("/api/addstudent", { name, date, place });
  }
  static async deleteStudent(id: string) {
    return api.post<AuthResponce>("/api/deletestudent", { id });
  }
}

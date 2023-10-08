import api from "@/http";

export default class ContractService {
  static async getMessage() {
    return api.get("/api/message/getmessage");
  }
  static async sendMessage(id: string, message: string) {
    return api.post("/api/message/sendmessage", {
      id,
      message,
    });
  }
}

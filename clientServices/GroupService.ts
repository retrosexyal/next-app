import { IGroup } from "@/clientModels/IGroup";
import { GroupResponse } from "@/clientModels/responce/GroupResponce";
import api from "@/http";

export default class GroupService {
  static async createGroup({ name, students }: IGroup) {
    return api.post<GroupResponse>("/api/group", {
      name,
      students,
    });
  }
}

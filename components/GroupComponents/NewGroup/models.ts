import { IStudent } from "@/clientModels/IStudent";
import { StudentGroupRowProps } from "../StudentGroupRow/models";

export type NewGroupProps = {
  students: IStudent[];
  handleDelete: (student?: IStudent) => () => void;
  groupName?: string;
};

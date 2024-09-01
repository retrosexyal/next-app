import { IStudent } from "./IStudent";

export type MarkProps = "single" | "subscription" | "documentation";

export type StudentGroupType = {
  student: IStudent;
  mark?: MarkProps;
};

export interface IGroup {
  name: string;
  students: StudentGroupType[];
}

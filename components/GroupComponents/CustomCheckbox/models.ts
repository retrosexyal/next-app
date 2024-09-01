import { MarkProps, StudentGroupType } from "@/clientModels/IGroup";
import { IStudent } from "@/clientModels/IStudent";
import { Dispatch, SetStateAction } from "react";

export type CustomCheckboxType = {
  students: StudentGroupType[];
  setStudent: Dispatch<SetStateAction<StudentGroupType[]>>;
  currentField: MarkProps;
  currentStudent: IStudent;
};

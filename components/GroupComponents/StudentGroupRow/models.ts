import { IStudent } from "@/clientModels/IStudent";

export type StudentGroupRowProps = {
  student: IStudent;
  onSelect: (student: IStudent) => () => void;
  selectStatus?: boolean;
};

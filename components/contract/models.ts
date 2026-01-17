import { IContract } from "@/interface/iContact";
import { Dispatch, SetStateAction } from "react";

export type ContractProps = {
  info: IContract;
  setInfo: Dispatch<SetStateAction<IContract[]>>;
};

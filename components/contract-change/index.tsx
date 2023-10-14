import { IContract } from "@/interface/iContact";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import ContractService from "@/clientServices/ContractService";
import { Loader } from "../loader";

export const ContractChange = ({ contract }: { contract: IContract }) => {
  const [contractInfo, setContractInfo] = useState<IContract>(contract);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = () => {
    setIsLoading(true);
    ContractService.changeContract(contractInfo)
      .then((data) => alert("Информация успешно обновлена"))
      .catch((e) => alert("Ошибка"))
      .finally(() => setIsLoading(false));
  };
  return (
    <div>
      <div>
        Имя родителя:
        <input
          type="text"
          value={contractInfo.parentName}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, parentName: e.target.value })
          }
        />
      </div>
      <div>
        Серия паспорта:
        <input
          type="text"
          value={contractInfo.KB}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, KB: e.target.value })
          }
        />
      </div>
      <div>
        День рождения:{" "}
        <input
          type="date"
          value={contractInfo.birthday}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, birthday: e.target.value })
          }
        />
      </div>
      <div>
        Имя ребёнка:{" "}
        <input
          type="text"
          value={contractInfo.childrenName}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, childrenName: e.target.value })
          }
        />
      </div>
      <div>
        Хронические заболевания:{" "}
        <input
          type="text"
          value={contractInfo.diseases}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, diseases: e.target.value })
          }
        />
      </div>
      <div>
        Когда выдан паспорт:{" "}
        <input
          type="text"
          value={contractInfo.pasportDate}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, pasportDate: e.target.value })
          }
        />
      </div>
      <div>
        Кем выдан паспорт:{" "}
        <input
          type="text"
          value={contractInfo.pasportPlace}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, pasportPlace: e.target.value })
          }
        />
      </div>
      <div>
        Телефон:{" "}
        <input
          type="text"
          value={contractInfo.phone}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, phone: e.target.value })
          }
        />
      </div>
      <div>
        Место проведения:{" "}
        <input
          type="text"
          value={contractInfo.place}
          onChange={(e) =>
            setContractInfo({ ...contractInfo, place: e.target.value })
          }
        />
      </div>
      <Button onClick={handleChange}>изменить договор</Button>
      {isLoading && <Loader />}
    </div>
  );
};

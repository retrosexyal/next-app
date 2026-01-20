import { useAppDispatch, useAppSelector } from "@/store";
import React, { useEffect, useState } from "react";
import ContractService from "@/clientServices/ContractService";
import AuthService from "@/clientServices/AuthService";
import { setUser } from "@/store/slices/userSlice";
import { IContract } from "@/interface/iContact";
import styles from "./admin.module.scss";
import { Button } from "@mui/material";
import Link from "next/link";
import { Backdrop, CircularProgress } from "@mui/material";
import Popup from "@/components/popup";
import { ContractChange } from "@/components/contract-change";
import { MessageToUser } from "@/components/message-to-user";

function formatDate(date: string) {
  const parts = date.split("-");
  const day = parts[2];
  const month = parts[1];
  const year = parts[0];
  return `${day}.${month}.${year}`;
}

const Admin = () => {
  const { email } = useAppSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IContract[] | null>(null);
  const dispatch = useAppDispatch();
  const [isHiden, setIsHiden] = useState(true);
  const [isShowChange, setIsShowChange] = useState(false);
  const [isShowSendMessage, setIsShowSendMessage] = useState(false);
  const [idToMessage, setidToMessage] = useState("");
  const [dataToChange, setDataToChange] = useState<IContract | null>(null);

  useEffect(() => {
    setIsLoading(true);
    AuthService.refresh()
      .then(({ data }) => {
        const userData = data.user;
        dispatch(setUser(userData));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    if (!email) {
      return;
    }

    if (!data || isLoading) {
      ContractService.getAllContract()
        .then(({ data }) => setData(data))
        .catch((e) => console.error(e))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isLoading, email, data]);

  const handleCreate = (e: React.MouseEvent) => {
    const userId = (e.target as HTMLDivElement).getAttribute("data-id");
    const contractId = (e.target as HTMLDivElement).getAttribute(
      "data-contract-id",
    );

    setIsLoading(true);
    if (userId && contractId) {
      try {
        ContractService.createContract(contractId)
          .then(() => {
            setIsLoading(false);
          })
          .catch((e) => {
            console.log("ошибка первая " + e);
            setIsLoading(false);
          });
      } catch (e) {
        alert("ошибка");
        console.log(e);
      }
      try {
        const contract = data?.find((obj) => obj["_id"] === contractId);
        if (contract) {
          AuthService.addStudent(
            contract.childrenName,
            contract.birthday,
            contract.place,
            contract.place,
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  const handleDelete = (e: React.MouseEvent) => {
    const userId = (e.target as HTMLDivElement).getAttribute("data-id");
    const contractId = (e.target as HTMLDivElement).getAttribute(
      "data-contract-id",
    );
    setIsLoading(true);
    const key = prompt(
      `вы хотите вернуть договор?\n
      напишите "да" для подтверждения`,
    );
    if (userId && contractId && key === "да") {
      try {
        ContractService.deleteContract({ contractId, userId })
          .then(() => {
            setIsLoading(false);
          })
          .catch((e) => {
            console.log("ошибка первая " + e);
            setIsLoading(false);
          });
      } catch (e) {
        alert("ошибка");
        console.log(e);
      }
    }
  };
  const handleContract = () => {
    setIsHiden(!isHiden);
  };

  const handleShowChange = (data: IContract) => {
    setIsShowChange(!isShowChange);
    setDataToChange(data);
  };

  const handleSendMessage = (id: string) => {
    setIsShowSendMessage(true);
    setidToMessage(id);
  };

  const handleBirthday = () => {
    try {
      ContractService.checkBirthday()
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log("ошибка первая " + e);
          setIsLoading(false);
        });
    } catch (e) {
      alert("ошибка");
      console.log(e);
    }
  };

  if (email !== "admin@admin") {
    return <div>необходимо перелогиниться, ИЛИ НЕТ ДОСТУПА</div>;
  }

  const handleSendMail = (forMe?: boolean) => (e: any) => {
    const userId = (e.target as HTMLDivElement).getAttribute("data-id");
    const contractId = (e.target as HTMLDivElement).getAttribute(
      "data-contract-id",
    );

    setIsLoading(true);
    if (contractId && userId) {
      try {
        ContractService[forMe ? "senContractToAdmin" : "senContractToParent"]({
          contractId,
          userId,
        })
          .catch(() => {
            alert("ошибка");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (e) {
        alert("ошибка");
      }
    }
  };

  return (
    <div style={{ paddingTop: "80px" }} className="wrapper">
      <div className={styles.wrapper}>
        <Link className={styles.link} href="/">
          Вернуться на главную страницу
        </Link>
        {email === "admin@admin" && (
          <Button onClick={handleBirthday}>Проверить дни рождения</Button>
        )}
        <Button onClick={handleContract}>Получить все договоры</Button>
        {email === "admin@admin" && (
          <div>
            <div>
              {data &&
                data.map((contract, ind) => {
                  return (
                    <React.Fragment
                      key={`${contract.user}_${ind}_${contract._id}`}
                    >
                      {!contract.isDone && contract.isSend && (
                        <div className={styles.container}>
                          <div>Имя родителя: {contract.parentName}</div>
                          <div>Серия паспорта: {contract.KB}</div>
                          <div>День рождения: {contract.birthday}</div>
                          <div>Имя ребёнка: {contract.childrenName}</div>
                          <div>
                            Хронические заболевания: {contract.diseases}
                          </div>
                          <div>Когда выдан паспорт: {contract.pasportDate}</div>
                          <div>Кем выдан паспорт: {contract.pasportPlace}</div>
                          <div>Телефон: {contract.phone}</div>
                          <div>Место проведения: {contract.place}</div>

                          <Button
                            onClick={handleSendMail()}
                            data-id={`${contract.user}`}
                            data-contract-id={`${contract["_id"]}`}
                            variant="contained"
                          >
                            отправить родителям
                          </Button>
                          <Button
                            onClick={handleSendMail(true)}
                            data-contract-id={`${contract["_id"]}`}
                            data-id={`${contract.user}`}
                            variant="contained"
                          >
                            отправить мне
                          </Button>
                          <Button
                            onClick={handleCreate}
                            data-id={`${contract.user}`}
                            data-contract-id={`${contract["_id"]}`}
                            variant="contained"
                          >
                            Закончить создание
                          </Button>
                          <Button
                            onClick={handleDelete}
                            data-id={`${contract.user}`}
                            data-contract-id={`${contract["_id"]}`}
                          >
                            Вернуть договор
                          </Button>
                          <Button
                            onClick={() => handleSendMessage(contract.user)}
                          >
                            Написать сообщение
                          </Button>
                          <Button
                            onClick={() => handleShowChange(contract)}
                            data-id={`${contract.user}`}
                            data-contract-id={`${contract["_id"]}`}
                          >
                            Изменить договор
                          </Button>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              {!isHiden &&
                data &&
                data.map((contract) => {
                  return (
                    <React.Fragment key={contract.user}>
                      {
                        <div className={styles.container}>
                          <div>Имя родителя: {contract.parentName}</div>
                          <div>Серия паспорта: {contract.KB}</div>
                          <div>День рождения: {contract.birthday}</div>
                          <div>Имя ребёнка: {contract.childrenName}</div>
                          <div>
                            Хронические заболевания: {contract.diseases}
                          </div>
                          <div>Когда выдан паспорт: {contract.pasportDate}</div>
                          <div>Кем выдан паспорт: {contract.pasportPlace}</div>
                          <div>Телефон: {contract.phone}</div>
                          <div>Место проведения: {contract.place}</div>
                          <Button
                            onClick={handleDelete}
                            data-id={`${contract.user}`}
                          >
                            Вернуть договор
                          </Button>
                        </div>
                      }
                    </React.Fragment>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme: { zIndex: { drawer: number } }) =>
              theme.zIndex.drawer + 1,
          }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {isShowChange && (
        <Popup onClick={() => setIsShowChange(!isShowChange)}>
          {dataToChange && <ContractChange contract={dataToChange} />}
        </Popup>
      )}
      {isShowSendMessage && (
        <Popup onClick={() => setIsShowSendMessage(false)}>
          {idToMessage && <MessageToUser id={idToMessage} />}
        </Popup>
      )}
    </div>
  );
};

export default Admin;

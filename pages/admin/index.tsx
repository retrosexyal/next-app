import { useAppDispatch, useAppSelector } from "@/store";
import React, { useEffect, useState } from "react";
import ContractService from "@/clientServices/ContractService";
import AuthService from "@/clientServices/AuthService";
import { setUser } from "@/store/slices/userSlice";
import { IContract } from "@/interface/iContact";
import styles from "./admin.module.scss";
import { Button } from "@mui/material";
import Link from "next/link";

const Admin = () => {
  const { email } = useAppSelector((state) => state.user.user);
  const [data, setData] = useState<IContract[] | null>(null);
  const dispatch = useAppDispatch();
  const [isHiden, setIsHiden] = useState(true);

  useEffect(() => {
    AuthService.refresh()
      .then(({ data }) => {
        const userData = data.user;
        dispatch(setUser(userData));
      })
      .catch((err) => {
        console.log(err);
      });
    ContractService.getAllContract()
      .then(({ data }) => setData(data))
      .catch((e) => console.error(e));
  }, []);

  const handleCreate = (e: React.MouseEvent) => {
    const id = (e.target as HTMLDivElement).getAttribute("data-id");
    console.log(id);
    ContractService.createContract(id!);
  };
  const handleContract = () => {
    setIsHiden(!isHiden);
  };
  return (
    <div className="wrapper">
      <div className={styles.wrapper}>
        <Link className={styles.link} href="/">
          Вернуться на главную страницу
        </Link>
        <Button onClick={handleContract}>Получить все договоры</Button>
        {email === "admin@admin" && (
          <div>
            <div>
              {data &&
                data.map((contract) => {
                  return (
                    <React.Fragment key={contract.user}>
                      {!contract.isDone && (
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
                            onClick={handleCreate}
                            data-id={`${contract.user}`}
                          >
                            Создать договор
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
                        </div>
                      }
                    </React.Fragment>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

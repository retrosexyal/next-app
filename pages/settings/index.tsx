import Students from "@/components/students";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./settings.module.scss";
import { useAppDispatch, useAppSelector } from "@/store";
import { Contract } from "@/components/contract";
import AuthService from "@/clientServices/AuthService";
import { setUser } from "@/store/slices/userSlice";
import ContractService from "@/clientServices/ContractService";
import MessageService from "@/clientServices/MessageService";
import { IContract } from "@/interface/iContact";
import { Loader } from "@/components/loader";
import { ContractInfo } from "@/components/contract-info";
import { status as STATUS } from "@/constants/constants";

const Settings = () => {
  const { isActivated, email, id, status } = useAppSelector(
    (state) => state.user.user
  );
  const [data, setData] = useState<IContract | null>(null);
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    AuthService.refresh()
      .then(({ data }) => {
        const userData = data.user;
        dispatch(setUser(userData));
      })
      .then(() => {
        if (id) {
          ContractService.getContract(id)
            .then(({ data }) => {
              setData(data);
            })
            .catch((err) => {
              console.log(err);
            });
          MessageService.getMessage()
            .then((data) => setMessage(data.data.message))
            .catch((e) => console.error(e));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, id]);

  return (
    <div className={`wrapper ${styles.wrapper}`}>
      <Link className={styles.link} href="/">
        Вернуться на главную страницу
      </Link>
      <Link className={styles.link} href="/password/change">
        Изменить пароль
      </Link>
      {email === "admin@admin" && (
          <Link className={styles.link} href="/groups">
            Мои группы
          </Link>
      )}
      {email === "admin@admin" && (
        <>
          <Link className={styles.link} href="/admin">
            Согласование договоров
          </Link>
          <Students />
        </>
      )}
      <div>
        {isActivated && email !== "admin@admin" && status !== STATUS.SEND && (
          <Contract />
        )}
      </div>
      {data?.isDone && email !== "admin@admin" && <ContractInfo data={data} />}
      <div>
        {data &&
          !data.isDone &&
          email !== "admin@admin" &&
          status === STATUS.SEND && (
            <div className={styles.content_wrapper}>
              <h2 style={{ textAlign: "center" }}>
                Ваш договор находится на согласовании у руководителя студии
              </h2>
              <h3 style={{ textAlign: "center" }}>
                После подписания он будет направлен Вам в почту
              </h3>
            </div>
          )}
      </div>
      {message && (
        <div>
          <h2 style={{ textAlign: "center" }}>
            Сообщение от руководителя студии ЛиМи:
          </h2>
          <h3 style={{ textAlign: "center" }}>{message}</h3>
        </div>
      )}
      {isLoading && <Loader />}
    </div>
  );
};

export default Settings;

import Students from "@/components/students";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./settings.module.scss";
import { useAppDispatch, useAppSelector } from "@/store";
import { Contract } from "@/components/contract";
import AuthService from "@/clientServices/AuthService";
import { setUser } from "@/store/slices/userSlice";
import ContractService from "@/clientServices/ContractService";
import { IContract } from "@/interface/iContact";
import { Backdrop, CircularProgress } from "@mui/material";

const Settings = () => {
  const { isActivated, email, id, status } = useAppSelector(
    (state) => state.user.user
  );
  const [data, setData] = useState<IContract | null>(null);
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
        <>
          <Link className={styles.link} href="/admin">
            Согласование договоров
          </Link>
          <Students />
        </>
      )}
      <div>
        {isActivated && email !== "admin@admin" && !status && <Contract />}
      </div>
      {data?.isDone && email !== "admin@admin" && (
        <div className={styles.content_wrapper}>
          <h2>Информация внесённая в договор</h2>
          <div className={styles.content_wrapper}>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>ФИО родителя: </div>
              <div className={styles.content}>{data.parentName}</div>
            </div>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>Серия паспорта: </div>
              <div className={styles.content}>{data.KB}</div>
            </div>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>Когда выдан паспорта: </div>
              <div className={styles.content}>{data.pasportDate}</div>
            </div>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>Кем выдан паспорт: </div>
              <div className={styles.content}>{data.pasportPlace}</div>
            </div>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>Контактный телефон: </div>
              <div className={styles.content}>{data.phone}</div>
            </div>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>Место занятий: </div>
              <div className={styles.content}>{data.place}</div>
            </div>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>ФИО ребёнка: </div>
              <div className={styles.content}>{data.childrenName}</div>
            </div>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>Дата рождения ребёнка: </div>
              <div className={styles.content}>{data.birthday}</div>
            </div>
            <div className={styles.flex_wrapper}>
              <div className={styles.title}>
                Хронические заболевания ребёнка:{" "}
              </div>
              <div className={styles.content}>{data.diseases}</div>
            </div>
          </div>
        </div>
      )}
      <div>
        {data && !data.isDone && email !== "admin@admin" && status && (
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
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
};

export default Settings;

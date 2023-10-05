import React from "react";
import styles from "./contract-info.module.scss";
import { IContract } from "@/interface/iContact";

interface IProps {
  data: IContract;
}

export const ContractInfo: React.FC<IProps> = ({ data }) => {
  return (
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
          <div className={styles.title}>Хронические заболевания ребёнка: </div>
          <div className={styles.content}>{data.diseases}</div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import styles from "./contract-info.module.scss";
import { IContract } from "@/interface/iContact";

interface IProps {
  data: IContract;
}

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className={styles.row}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);

export const ContractInfo: React.FC<IProps> = ({
  data: {
    KB,
    address,
    birthday,
    childrenName,
    diseases,
    parentName,
    pasportDate,
    pasportPlace,
    phone,
    place,
  },
}) => {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Информация, внесённая в договор</h2>

      <div className={styles.card}>
        <InfoRow label="ФИО родителя" value={parentName} />
        <InfoRow label="Серия паспорта" value={KB} />
        <InfoRow label="Когда выдан паспорт" value={pasportDate} />
        <InfoRow label="Кем выдан паспорт" value={pasportPlace} />
        <InfoRow label="Контактный телефон" value={phone} />
        <InfoRow label="Место занятий" value={place} />
        <InfoRow label="ФИО ребёнка" value={childrenName} />
        <InfoRow label="Дата рождения ребёнка" value={birthday} />
        <InfoRow label="Хронические заболевания" value={diseases || "—"} />
        <InfoRow label="Адрес проживания" value={address || "—"} />
      </div>
    </section>
  );
};

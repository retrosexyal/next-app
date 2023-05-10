import React, { useState } from "react";
import styles from "./addstudent.module.scss";
import AuthService from "@/clientServices/AuthService";

function formatDate(date: string) {
  const parts = date.split("-");
  const day = parts[2];
  const month = parts[1];
  const year = parts[0];
  return `${day}.${month}.${year}`;
}

const AddStudent = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    date: "",
    place: "ДГ",
    group: "",
  });

  const { name, date, place, group } = studentInfo;
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentInfo({ ...studentInfo, name: e.target.value });
  };
  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentInfo({ ...studentInfo, date: e.target.value });
  };
  const handlePlace = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentInfo({ ...studentInfo, place: e.target.value });
  };
  const handleGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentInfo({ ...studentInfo, group: e.target.value });
  };

  const handleSubmit = () => {
    AuthService.addStudent(name, formatDate(date), place, group);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        Фамилия Имя
        <input type="text" value={name} onChange={handleName} />
      </label>
      <label className={styles.label}>
        Дата рождения
        <input type="date" value={date} onChange={handleDate} />
      </label>
      <label className={styles.label}>
        Место занятия
        <select value={place} onChange={handlePlace}>
          <option value="ДГ">Дворец гимнастики</option>
          <option value="ФОК Фатина">ФОК Фатина</option>
          <option value="ФОК Орловского">ФОК Орловского</option>
        </select>
      </label>
      <label className={styles.label}>
        Группа
        <input type="text" value={group} onChange={handleGroup} />
      </label>
      <button type="button" onClick={handleSubmit}>
        Добавить
      </button>
    </div>
  );
};

export default AddStudent;

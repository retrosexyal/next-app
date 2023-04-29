import { IStudent } from "@/clientModels/IStudent";
import AuthService from "@/clientServices/AuthService";
import React, { useState } from "react";
import { arrayStudents } from "@/constants/constants";

function formatDate(date: string) {
  const parts = date.split("-");
  const day = parts[2];
  const month = parts[1];
  const year = parts[0];
  return `${day}.${month}.${year}`;
}

const Admin = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    date: "",
    place: "ДГ",
  });
  const [students, setStudents] = useState<IStudent[]>([]);

  const { name, date, place } = studentInfo;

  const handleSubmit = () => {
    AuthService.addStudent(name, formatDate(date), place);
  };

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentInfo({ ...studentInfo, name: e.target.value });
  };
  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentInfo({ ...studentInfo, date: e.target.value });
  };
  const handlePlace = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentInfo({ ...studentInfo, place: e.target.value });
  };

  const handleGetStudents = async () => {
    const students = await AuthService.getStudents();
    setStudents(students.data);
    console.log(students);
  };

  const handleDeleteStudent = (e: React.MouseEvent) => {
    const id = (e.target as HTMLDivElement).getAttribute("data-id");
    const isButton =
      (e.target as HTMLDivElement).tagName.toUpperCase() === "BUTTON";
    if (id && isButton) {
      const conf2 = confirm("точно удалить?");
      if (conf2) {
        AuthService.deleteStudent(id!);
      }
    }
  };

  const handleTest = () => {};

  return (
    <div>
      <label>
        Фамилия Имя
        <input type="text" value={name} onChange={handleName} />
      </label>
      <label>
        Дата рождения
        <input type="date" value={date} onChange={handleDate} />
      </label>
      <label>
        Место занятия
        <select value={place} onChange={handlePlace}>
          <option value="ДГ">Дворец гимнастики</option>
          <option value="ФОК Фатина">ФОК Фатина</option>
          <option value="ФОК Орловского">ФОК Орловского</option>
        </select>
      </label>
      <button type="button" onClick={handleSubmit}>
        Добавить
      </button>
      <button type="button" onClick={handleGetStudents}>
        получить список студентов
      </button>
      <div onClick={handleDeleteStudent}>
        {students.map((e) => {
          return (
            <div key={e._id} data-id={e._id}>
              {`${e.name}  ${e.date} ${e.place}`}
              <button data-id={e._id}> удалить ученика</button>
            </div>
          );
        })}
      </div>
      <button onClick={handleTest}>test</button>
    </div>
  );
};

export default Admin;

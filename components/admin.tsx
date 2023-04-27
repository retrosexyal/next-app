import { IStudent } from "@/clientModels/IStudent";
import AuthService from "@/clientServices/AuthService";
import React, { useState } from "react";

const Admin = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    date: "",
    place: "ДГ",
  });
  const [students, setStudents] = useState<IStudent[]>([]);

  const { name, date, place } = studentInfo;

  const handleSubmit = () => {
    AuthService.addStudent(name, date, place);
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
    if (id) {
      AuthService.deleteStudent(id!);
    }
  };

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
              {e.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;

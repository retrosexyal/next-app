import { IStudent } from "@/clientModels/IStudent";
import AuthService from "@/clientServices/AuthService";
import React, { useEffect, useState } from "react";
import styles from "./students.module.scss";
import Popup from "../popup";
import AddStudent from "../addstudent";

const Students = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [find, setFind] = useState("");
  const [sort, setSort] = useState("");
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [studChange, setStudChange] = useState({
    id: "",
    name: "",
    place: "",
    date: "",
    group: "",
  });
  const [isChange, setIsChange] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await AuthService.getStudents();
        setStudents(students.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleFind = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFind(e.target.value);
  };
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };
  const handleChange = (e: React.MouseEvent<HTMLElement>) => {
    console.log((e.target as HTMLElement).getAttribute("data-change"));
    if ((e.target as HTMLElement).getAttribute("data-change")) {
      setStudChange({
        ...studChange,
        id: (e.target as HTMLElement).getAttribute("data-change")!,
      });
      setIsChange(!isChange);
    }

    if ((e.target as HTMLElement).getAttribute("data-del")) {
      const key = prompt(
        `вы хотите удалить ${(e.target as HTMLElement).getAttribute(
          "data-name"
        )}?\n
        напишите "удалить" для подтверждения`
      );
      if (key === "удалить") {
        AuthService.deleteStudent(
          (e.target as HTMLElement).getAttribute("data-del")!
        );
      }
    }
  };
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudChange({ ...studChange, name: e.target.value });
  };
  const handlePlace = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudChange({ ...studChange, place: e.target.value });
  };
  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudChange({ ...studChange, date: e.target.value });
  };
  const handleGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudChange({ ...studChange, group: e.target.value });
  };
  const handleSave = () => {
    AuthService.changeStudent(
      studChange.id,
      studChange.name,
      studChange.place,
      studChange.date,
      studChange.group
    ).catch((err) => console.log(err));
    setIsChange(false);
  };

  const showPopUp = () => {
    setIsShowPopup(!isShowPopup);
  };

  const handleRefresh = () => {
    const fetchData = async () => {
      try {
        const students = await AuthService.getStudents();
        setStudents(students.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  };

  return (
    <>
      <div className={styles.nav}>
        <select
          defaultValue="name"
          onChange={handleSort}
          className={styles.select}
        >
          <option value="name">по имени</option>
          <option value="group">по группе</option>
          <option value="place">по месту</option>
        </select>
        <input
          type="text"
          placeholder="найти"
          onChange={handleFind}
          className={styles.find}
        />
      </div>
      <button onClick={showPopUp}>Добавить малыша</button>
      <button type="button" onClick={handleRefresh}>
        Обновить
      </button>
      {isShowPopup && (
        <Popup onClick={showPopUp}>
          <AddStudent />
        </Popup>
      )}
      <div className={styles.wrapper} onClick={handleChange}>
        {[...students]
          .filter((stud) => {
            return (stud.name + stud.place + stud.group + stud.date)
              .toUpperCase()
              .includes(find.toLocaleUpperCase());
          })
          .sort((a, b) => {
            return a[sort as keyof typeof a] > b[sort as keyof typeof b]
              ? 1
              : -1;
          })
          .map((e) => {
            return (
              <React.Fragment key={e._id}>
                {!isChange && (
                  <div className={styles.student} data-id={e._id}>
                    <div className={styles.name}>{e.name}</div>
                    <div className={styles.date}>{e.date}</div>
                    <div className={styles.place}>{e.place}</div>
                    <div className={styles.group}>{e.group}</div>
                    <button
                      className={styles.button}
                      data-del={e._id}
                      data-name={e.name}
                    >
                      уд.
                    </button>
                    <button className={styles.button} data-change={`${e._id}`}>
                      ред.
                    </button>
                  </div>
                )}
                {isChange && e._id === studChange.id && (
                  <div className={styles.student} key={e._id} data-id={e._id}>
                    <input
                      className={styles.name}
                      value={studChange.name || e.name}
                      onChange={handleName}
                    />
                    <input
                      className={styles.date}
                      value={studChange.date || e.date}
                      onChange={handleDate}
                    />
                    <input
                      className={styles.place}
                      value={studChange.place || e.place}
                      onChange={handlePlace}
                    />
                    <input
                      className={styles.group}
                      value={studChange.group || e.group}
                      onChange={handleGroup}
                    />
                    <button className={styles.button} onClick={handleSave}>
                      сохранить
                    </button>
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </div>
    </>
  );
};

export default Students;

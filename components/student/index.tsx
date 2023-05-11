import React, { useState } from "react";
import styles from "./student.module.scss";
import { IStudent } from "@/clientModels/IStudent";

interface IProps {
  info: IStudent;
}

const Student: React.FC<IProps> = ({ info }) => {
  const [isShow, setIsShow] = useState(false);

  const handleShow = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).getAttribute("data-close") === "close") {
      setIsShow(!isShow);
    }
  };
  return (
    <div className={styles.student} onClick={handleShow}>
      <div className={styles.name}>{info.name}</div>
      <div className={styles.date}>{info.date}</div>
      <div className={styles.place}>{info.place}</div>
      <div className={styles.group}>{info.group}</div>
      <div className={styles.show_btn} data-close="close">
        ...
        {isShow && (
          <div className={styles.btn_cont}>
            <button
              className={styles.button}
              data-del={info._id}
              data-name={info.name}
              data-close="close"
            >
              уд.
            </button>
            <button
              className={styles.button}
              data-change={`${info._id}`}
              data-close="close"
            >
              ред.
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;

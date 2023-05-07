import React from "react";
import Image from "next/image";
import styles from "./main.module.scss";
import mainImg from "/public/imgs/concert4_smal.jpg";
import Header from "../header";

const Main = () => {
  return (
    <div className={styles.wrapper}>
      <Header className={styles.header} />
      <div className={styles.content_wrapper}>
        <div>
          <p className={styles.main_text}>ВАШ РЕБЕНОК ХОЧЕТ ТАНЦЕВАТЬ?</p>
          <p className={styles.sub_text}>
            Приглашаем всех желающих от 3х до 18 лет на занятия по хореографии,
            дефиле и гимнастики
          </p>
          <button>ПОЗВОНИТЬ</button>
          <button>ОСТАВИТЬ ЗАЯВКУ</button>
        </div>
        <div className={styles.img_wrapper}>
          <Image className={styles.img} src={mainImg} alt="Example Image" />
        </div>
      </div>
    </div>
  );
};

export default Main;

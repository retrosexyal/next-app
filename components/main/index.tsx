import React from "react";
import Image from "next/image";
import styles from "./main.module.scss";
import mainImg from "/public/imgs/background_main1.webp";
import Header from "../header";
import { Button } from "@mui/material";
import HiddenMenu from "../hidden-menu";

const Main = () => {
  return (
    <div className={styles.wrapper}>
      <Image className={styles.img} src={mainImg} alt="background" />
      <div className="wrapper">
        <Header className={styles.header} />

        <div className={styles.content}>
          <div className={styles.title}>
            <h1 className={styles.title_main}>
              Школа-студия Елизаветы Михеенко
            </h1>
            <h2 className={styles.title_logo}>ЛиМи</h2>
          </div>
          <p className={styles.main_text}>ВАШ РЕБЕНОК ХОЧЕТ ТАНЦЕВАТЬ?</p>
          <p className={styles.sub_text}>
            Приглашаем всех желающих от 3х до 18 лет на занятия по хореографии,
            дефиле и гимнастики
          </p>
          <Button variant="contained" className={styles.btn}>
            ПОЗВОНИТЬ
          </Button>
          <HiddenMenu />
          <button>ПОЗВОНИТЬ</button>
          <button>ОСТАВИТЬ ЗАЯВКУ</button>
        </div>
      </div>
    </div>
  );
};

export default Main;

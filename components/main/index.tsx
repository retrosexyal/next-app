import React, { useState } from "react";
import Image from "next/image";
import styles from "./main.module.scss";
import mainImg from "/public/imgs/background_main1.webp";
import Header from "../header";
import { Button } from "@mui/material";
import Popup from "../popup";
import { FormSend } from "../form-send";

const Main = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const makeCall = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
        userAgent
      );
    if (isMobile) {
      return (window.location.href = "tel:+375291234567");
    } else {
      setIsPressed(true);
    }
  };
  const openForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  return (
    <>
      <div className={styles.wrapper} id="main">
        <Image className={styles.img} src={mainImg} alt="background" />
        <div className="wrapper">
          <Header className={styles.header} />

          <div className={styles.content}>
            <div className={styles.content_background}>
              <p className={styles.main_text}>ВАШ РЕБЕНОК ХОЧЕТ ТАНЦЕВАТЬ?</p>
              <p className={styles.sub_text}>
                Приглашаем всех желающих от 3х до 18 лет на занятия по
                хореографии, дефиле и гимнастики
              </p>
            </div>
            <Button
              variant="contained"
              className={styles.btn}
              onClick={makeCall}
            >
              {!isPressed ? "ПОЗВОНИТЬ" : "+375(29)199-92-31"}
            </Button>
            <Button
              variant="contained"
              className={styles.btn}
              onClick={openForm}
            >
              ОСТАВИТЬ ЗАЯВКУ
            </Button>
          </div>
        </div>
        <>
          {isFormOpen && (
            <Popup onClick={openForm}>
              <FormSend />
            </Popup>
          )}
        </>
      </div>
    </>
  );
};

export default Main;

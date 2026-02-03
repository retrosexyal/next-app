import { useState } from "react";
import Image from "next/image";
import styles from "./main.module.scss";
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
        userAgent,
      );
    if (isMobile) {
      return (window.location.href = "tel:+375291999231");
    } else {
      setIsPressed(true);
    }
  };

  const openForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <section className={styles.hero} id="main">
      <Image
        src="/imgs/background_main1.webp"
        alt="Дети на сцене"
        fill
        priority
        className={styles.img}
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1 className={styles.title}>
          Ваш ребёнок хочет <span>двигаться красиво?</span>
        </h1>

        <p className={styles.subtitle}>
          Набор детей от <b>3 до 14 лет</b> на занятия по танцам и гимнастике.
          Развиваем осанку, уверенность и любовь к движению 💛
        </p>

        <div className={styles.actions}>
          <Button className={styles.cta} onClick={makeCall}>
            {!isPressed ? "Позвонить" : "+375 (29) 199-92-31"}
          </Button>

          <Button className={styles.secondary} onClick={openForm}>
            Оставить заявку
          </Button>
        </div>
      </div>
      {isFormOpen && (
        <Popup onClick={openForm}>
          <FormSend />
        </Popup>
      )}
    </section>
  );
};

export default Main;

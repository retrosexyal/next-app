import { Button } from "@mui/material";
import React, { useState } from "react";
import style from "./contact.module.scss";
import { FormSend } from "@/components/form-send";
import Popup from "@/components/popup";

export const Contact = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const makeCall = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
        userAgent
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
    <div className="wrapper" id="contact">
      <div className={style.wrapper}>
        <div className={style.title}>Вы готовы начать заниматься?</div>
        <div className={style.subtitle}>
          ПРОСТО СВЯЖИТЕСЬ С НАМИ В СОЦСЕТЯХ ИЛИ ПО ТЕЛЕФОНУ
        </div>
        <Button variant="contained" className={style.btn} onClick={makeCall}>
          {!isPressed ? "ПОЗВОНИТЬ" : "+375(29)199-92-31"}
        </Button>
        <Button variant="contained" className={style.btn} onClick={openForm}>
          ОСТАВИТЬ ЗАЯВКУ
        </Button>
        <>
          {isFormOpen && (
            <Popup onClick={openForm}>
              <FormSend />
            </Popup>
          )}
        </>
      </div>
    </div>
  );
};

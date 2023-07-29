import { Title } from "@/components/UI/title";
import { PhotoContainer } from "@/components/photo-conteiner";
import React from "react";
import { content } from "./constants";
import style from "./photo.module.scss";

export const Photo = () => {
  return (
    <div id="photo" className={style.wrapper}>
      <Title text="Каждое занятие - это особое событие" />
      <PhotoContainer arrOfSrcs="1" />
      <Title text="Наши выступления" />
      <PhotoContainer arrOfSrcs="2" />
      <Title text="Наши праздники" />
      <PhotoContainer arrOfSrcs="3" />
    </div>
  );
};

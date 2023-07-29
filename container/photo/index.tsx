import { Title } from "@/components/UI/title";
import { PhotoContainer } from "@/components/photo-conteiner";
import React from "react";
import { content } from "./constants";
import style from "./photo.module.scss";

export const Photo = () => {
  return (
    <div id="photo" className={style.wrapper}>
      <Title text="Каждое занятие - это особое событие" />
      <PhotoContainer arrOfSrcs={content.first} />
      <Title text="Наши выступления" />
      <PhotoContainer arrOfSrcs={content.second} />
      <Title text="Наши праздники" />
      <PhotoContainer arrOfSrcs={content.third} />
    </div>
  );
};

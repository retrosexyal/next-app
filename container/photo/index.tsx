import { Title } from "@/components/UI/title";
import { PhotoContainer } from "@/components/photo-conteiner";
import React from "react";
import { content } from "./constants";
import style from "./photo.module.scss";
import { Gallery } from "@/components/Gallery";

export const Photo = () => {
  return (
    <div id="photo" className={style.wrapper}>
      <Title text="Наши выступления" />
      <Gallery
        images={[
          "/imgs/concert/1.jpg",
          "/imgs/concert/2.jpg",
          "/imgs/concert/3.jpg",
          "/imgs/concert/4.jpg",
          "/imgs/concert/5.jpg",
          "/imgs/concert/6.jpg",
          "/imgs/concert/7.jpg",
        ]}
      />
      {/*       <PhotoContainer arrOfSrcs="1" /> */}
      <Title text="Каждое занятие - это особое событие" />
      <Gallery
        images={[
          "/imgs/lesson/1.jpg",
          "/imgs/lesson/2.jpg",
          "/imgs/lesson/3.jpg",
          "/imgs/lesson/4.jpg",
          "/imgs/lesson/5.jpg",
          "/imgs/lesson/6.jpg",
          "/imgs/lesson/7.jpg",
          "/imgs/lesson/8.jpg",
          "/imgs/lesson/9.jpg",
          "/imgs/lesson/10.jpg",
        ]}
      />
      {/* <PhotoContainer arrOfSrcs="2" /> */}
      <Title text="Наши праздники" />
      {/*       <PhotoContainer arrOfSrcs="3" /> */}
      <Gallery
        images={[
          "/imgs/holyday/1.jpg",
          "/imgs/holyday/2.jpg",
          "/imgs/holyday/3.JPG",
          "/imgs/holyday/4.JPG",
          "/imgs/holyday/5.JPG",
          "/imgs/holyday/6.JPG",
        ]}
      />
    </div>
  );
};

import { Title } from "@/components/UI/title";
import style from "./photo.module.scss";
import { Gallery } from "@/components/Gallery";

export const Photo = () => {
  return (
    <div id="photo" className={style.wrapper}>
      <Title text="Наши выступления" />
      <Gallery
        images={[
          "/imgs/concert/1.webp",
          "/imgs/concert/2.webp",
          "/imgs/concert/3.webp",
          "/imgs/concert/4.webp",
          "/imgs/concert/5.webp",
          "/imgs/concert/6.webp",
          "/imgs/concert/7.webp",
        ]}
      />
      <Title text="Каждое занятие - это особое событие" />
      <Gallery
        images={[
          "/imgs/lesson/1.webp",
          "/imgs/lesson/2.webp",
          "/imgs/lesson/3.webp",
          "/imgs/lesson/4.webp",
          "/imgs/lesson/5.webp",
          "/imgs/lesson/6.webp",
          "/imgs/lesson/7.webp",
          "/imgs/lesson/8.webp",
          "/imgs/lesson/9.webp",
          "/imgs/lesson/10.webp",
        ]}
      />
      <Title text="Наши праздники" />
      <Gallery
        images={[
          "/imgs/holyday/1.webp",
          "/imgs/holyday/2.webp",
          "/imgs/holyday/3.webp",
          "/imgs/holyday/4.webp",
          "/imgs/holyday/5.webp",
          "/imgs/holyday/6.webp",
        ]}
      />
    </div>
  );
};

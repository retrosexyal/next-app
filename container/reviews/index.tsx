import { Title } from "@/components/UI/title";
import { AboutCard } from "@/components/about-card";
import React from "react";
import { data } from "./constats";
import style from "./reviews.module.scss";

export const Reviews = () => {
  return (
    <div className={style.wrapper} id="reviews">
      <div className={`wrapper`}>
        <Title text="Отзывы о нас" />
        <div className={style.content_wrapper}>
          {data.map((e) => {
            return (
              <AboutCard
                key={e.title}
                subtitle={e.title}
                src={e.src}
                isStyled
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

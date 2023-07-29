import { AboutCard } from "@/components/about-card";
import React from "react";
import { content } from "./constants";
import { Title } from "@/components/UI/title";
import styles from "./ways.module.scss";

export const Ways = () => {
  return (
    <div className={styles.wrapper} id="ways">
      <div className="wrapper">
        <Title text="В нашей школе-студии мы обучаем" />
        <div className={styles.content}>
          {content.map((el) => {
            return (
              <AboutCard
                src={el.img}
                title={el.title}
                subtitle={el.subtitle}
                wayTitle={el.wayTitle}
                key={el.img}
                isStyled={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

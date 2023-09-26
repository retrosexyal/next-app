import React from "react";
import style from "./loader.module.scss";

export const Loader = () => {
  return (
    <div className={style.wrapper}>
      <div>Загрузка...</div>
    </div>
  );
};

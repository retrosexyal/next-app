import React from "react";
import style from "./footer.module.scss";
import { Svg } from "@/components/UI/svg";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className={style.wrapper}>
      <div className="wrapper">
        <div className={style.content_wrapper}>
          <div className={style.container}>
            <div className={style.title}>Могилев</div>
            <div className={style.container_content}>
              <div
                className={style.subtitle}
              >{`"Дворец гимнастики": ул. Крупской, 137`}</div>
              <div
                className={style.subtitle}
              >{`СДЮШОР: ул. Орловского, 24а`}</div>
              <div
                className={style.subtitle}
              >{`ФОК: ул. Златоустовского, 1`}</div>
            </div>
          </div>
          <div className={style.container}>
            <div className={style.title}>БОЛЬШЕ В СОЦСЕТЯХ</div>
            <div>
              <Link href="https://m.vk.com/limistudio?from=groups">
                <Svg type="vk" />
              </Link>
              <Link href="https://www.instagram.com/limistudio.by/">
                <Svg type="inst" />
              </Link>
            </div>
          </div>
          <div className={style.container}>
            <div className={style.title}>Телефон</div>
            <div className={style.subtitle}>+375 29 1 999 231</div>
          </div>
        </div>
      </div>
    </div>
  );
};

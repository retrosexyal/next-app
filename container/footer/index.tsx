import React from "react";
import style from "./footer.module.scss";
import { Svg } from "@/components/UI/svg";
import Link from "next/link";


export const Footer = () => {
  return (
    <footer className={style.wrapper}>
      <div className={style.documentsBar}>
        <div>
          <strong>Официальные документы ЛиМи</strong>
          <p>Государственная регистрация и аккредитация студии</p>
        </div>
        <Link href="/documents">Посмотреть документы <span aria-hidden="true">↗</span></Link>
      </div>
  {/* ОСНОВНОЙ ФУТЕР */}
  <div className={style.mainFooter}>
    <div className={style.container}>
      <div className={style.title}>Могилёв</div>
      <div className={style.subtitle}>
        {'"'}Дворец гимнастики{'"'}: ул. Крупской, 137
      </div>
      <div className={style.subtitle}>СДЮШОР: ул. Орловского, 24а</div>
      <div className={style.subtitle}>ФОК: ул. Златоустовского, 1</div>
    </div>

    <div className={style.container}>
      <div className={style.title}>Больше в соцсетях</div>
      <div className={style.socials}>
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
      <a href="tel:+375291999231" className={style.phone}>
        +375 29 1 999 231
      </a>
    </div>
  </div>

  {/* НИЖНЯЯ ПОЛОСА */}
  <div className={style.legalBar}>
    <Link href="/terms">Пользовательское соглашение</Link>
    <span>•</span>
    <Link href="/privacy">Политика конфиденциальности</Link>
  </div>
    </footer>
  );
};

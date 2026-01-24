import React, { useState } from "react";
import style from "./footer.module.scss";
import { Svg } from "@/components/UI/svg";
import Link from "next/link";
import Image from "next/image";

const Image1 = "/imgs/1.png";

export const Footer = () => {
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const handleOpenImg = (src: string) => () => {
    setCurrentImg(src);
  };

  return (
    <div className={style.wrapper}>
      {currentImg && (
        <div
          className={style.img_wrapper}
          style={{
            position: "fixed",
            width: "100dvw",
            height: "100dvh",
            background: "rgba(0,0,0,0.5)",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            setCurrentImg(null);
          }}
        >
          <Image
            src={currentImg}
            alt="sertificat"
            style={{ objectFit: "contain" }}
            width={1200}
            height={700}
          />
        </div>
      )}
        <div className={style.certWrapper}>
    <Image
      src={Image1}
      alt="sertificat"
      width={180}
      height={180}
      onClick={handleOpenImg(Image1)}
    />
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
    </div>
  );
};

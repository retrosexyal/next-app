import React, { useState } from "react";
import style from "./footer.module.scss";
import { Svg } from "@/components/UI/svg";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import Image1 from "assets/imgs/1.jpg";
import Image2 from "assets/imgs/2.jpg";

export const Footer = () => {
  const [currentImg, setCurrentImg] = useState<StaticImageData | null>(null);
  const handleOpenImg = (src: StaticImageData) => () => {
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
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <Image
          src={Image1}
          alt="sertificat"
          width={200}
          height={200}
          style={{ objectFit: "contain", cursor: "pointer" }}
          onClick={handleOpenImg(Image1)}
        />
        <Image
          src={Image2}
          alt="sertificat"
          width={200}
          height={200}
          style={{ objectFit: "contain", cursor: "pointer" }}
          onClick={handleOpenImg(Image2)}
        />
      </div>
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

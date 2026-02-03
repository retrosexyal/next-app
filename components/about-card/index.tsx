import React from "react";
import Image from "next/image";
import styles1 from "./aboutCard.module.scss";
import styles2 from "./reviewCard.module.scss";

interface IProps {
  title?: string;
  subtitle: string;
  src: string;
  wayTitle?: string;
  isStyled?: boolean;
}

export const AboutCard: React.FC<IProps> = ({
  title,
  subtitle,
  src,
  wayTitle,
  isStyled,
}) => {
  const styles = isStyled ? styles2 : styles1;

  const imgSrc = `/imgs/${src}`;
  return (
    <div className={styles.container}>
      <div className={styles.img_wrapper}>
        <Image
          className={isStyled ? styles.img : ""}
          src={imgSrc}
          alt="number of title"
          width={`${isStyled ? "300" : "80"}`}
          height={`${isStyled ? "300" : "80"}`}
          loading="lazy"
        />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.waytitle}>{wayTitle}</div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
  );
};

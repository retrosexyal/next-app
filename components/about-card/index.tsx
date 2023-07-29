import React from "react";
import Image from "next/image";
import styles from "./aboutCard.module.scss";

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
  return (
    <div className={styles.container}>
      <div className={styles.img_wrapper}>
        <Image
          className={isStyled ? styles.img : ""}
          src={require(`/public/imgs/${src}`)}
          alt="number of title"
        />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.waytitle}>{wayTitle}</div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
  );
};

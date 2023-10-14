import Popup from "@/components/popup";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./promo.module.scss";

interface IProps {
  closePromo: () => void;
}

export const Promo: React.FC<IProps> = ({ closePromo }) => {
  const handleClick = (e: React.MouseEvent) => {
    closePromo();
  };
  return (
    <div className={styles["background-image"]} onClick={handleClick}>
      <div className={styles.img_container}>
        <Image
          className={styles.img}
          src="/imgs/priglos.jpg"
          width="500"
          height="600"
          alt="background"
        />
        <div className={styles.text_container}>
          <p>предварительная запись</p>
          <p>обязательна!</p>
        </div>
      </div>
    </div>
  );
};

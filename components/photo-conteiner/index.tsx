import React from "react";
import styles from "./photo-container.module.scss";
import Image from "next/image";
interface IProps {
  arrOfSrcs: string[];
}
export const PhotoContainer: React.FC<IProps> = ({ arrOfSrcs }) => {
  return (
    <div className={styles.wrapper}>
      {arrOfSrcs.map((src) => {
        return (
          <div key={src} className={styles.img_wrapper}>
            <Image
              src={require(`public/imgs/photo/${src}`)}
              alt="picture"
              className={styles.img}
            />
          </div>
        );
      })}
    </div>
  );
};

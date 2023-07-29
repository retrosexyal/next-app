import React from "react";
import styles from "./photo-container.module.scss";
import Image from "next/image";
interface IProps {
  arrOfSrcs: string;
}
export const PhotoContainer: React.FC<IProps> = ({ arrOfSrcs }) => {
  return (
    <div className={styles.wrapper}>
      {arrOfSrcs === "1" && (
        <>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/1.jpg`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/2.jpg`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/3.jpg`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/4.jpg`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
        </>
      )}
      {arrOfSrcs === "2" && (
        <>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/concert1_smal.jpg`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/concert2_smal.JPG`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/concert3_smal.JPG`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/concert4_smal.jpg`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
        </>
      )}
      {arrOfSrcs === "3" && (
        <>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/prazdnik1_smal.JPG`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/prazdnik2_smal.JPG`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/prazdnik3_smal.JPG`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
          <div className={styles.img_wrapper}>
            <Image
              src={`/imgs/photo/prazdnik4_smal.JPG`}
              alt="picture"
              className={styles.img}
              width="400"
              height="400"
            />
          </div>
        </>
      )}
    </div>
  );
};

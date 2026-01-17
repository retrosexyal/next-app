import React from "react";
import styles from "./title.module.scss";

export const Title = ({ text }: { text: string }) => {
  return <p className={styles.content}>{text}</p>;
};

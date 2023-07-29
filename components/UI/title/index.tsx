import React from "react";
import styles from "./title.module.scss";

export const Title = ({ text }: { text: string }) => {
  return <div className={styles.content}>{text}</div>;
};

import React from "react";
import styles from "./button.module.scss";

interface IProps {
  text: string;
  onClick?: (e?: React.MouseEvent) => void;
}

const Button: React.FC<IProps> = ({ text, onClick }) => {
  return (
    <div className={styles.btn} onClick={onClick}>
      {text}
    </div>
  );
};

export default Button;

import React, { ReactNode } from "react";
import styles from "./popup.module.scss";
interface IProps {
  children: ReactNode;
  onClick: () => void;
}
const Popup: React.FC<IProps> = ({ children, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).getAttribute("data-close") === "close") {
      onClick();
    }
  };
  return (
    <div className={styles.wrapper} onClick={handleClick} data-close="close">
      <div className={styles.content}>
        <div className={styles.close} onClick={onClick}>
          X
        </div>
        {children}
      </div>
    </div>
  );
};

export default Popup;

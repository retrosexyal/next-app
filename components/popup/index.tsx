import React, { ReactNode } from "react";
import styles from "./popup.module.scss";
import CloseIcon from "@mui/icons-material/Close";
interface IProps {
  children: ReactNode;
  onClick: () => void;
}
const Popup: React.FC<IProps> = ({ children, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.close === "close") {
      onClick();
    }
  };

  return (
    <div
      className={styles.wrapper}
      onClick={handleClick}
      data-close="close"
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.content}>
        <button className={styles.close} onClick={onClick} aria-label="Закрыть">
          <CloseIcon />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Popup;

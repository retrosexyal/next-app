import styles from "./CustomCell.module.scss";

export function CustomCell({ children }:any) {
  return <div className={styles.scroll}>{children}</div>;
}

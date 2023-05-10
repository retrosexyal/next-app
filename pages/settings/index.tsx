import Students from "@/components/students";
import Link from "next/link";
import React from "react";
import styles from "./settings.module.scss";

const Settings = () => {
  return (
    <div className={`wrapper ${styles.wrapper}`}>
      <Link className={styles.link} href="/">
        Home
      </Link>
      <Students />
    </div>
  );
};

export default Settings;

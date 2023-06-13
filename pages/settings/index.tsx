import Students from "@/components/students";
import Link from "next/link";
import React, { useEffect } from "react";
import styles from "./settings.module.scss";
import { useAppDispatch, useAppSelector } from "@/store";
import { Contract } from "@/components/contract";
import AuthService from "@/clientServices/AuthService";
import { setUser } from "@/store/slices/userSlice";

const Settings = () => {
  const { isActivated, email, name } = useAppSelector(
    (state) => state.user.user
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    AuthService.refresh()
      .then(({ data }) => {
        const userData = data.user;
        dispatch(setUser(userData));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={`wrapper ${styles.wrapper}`}>
      <Link className={styles.link} href="/">
        Home
      </Link>
      {email === "admin@admin" && <Students />}
      {isActivated && <Contract />}
    </div>
  );
};

export default Settings;

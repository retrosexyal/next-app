import React, { useEffect, useState } from "react";
import styles from "./settings.module.scss";

import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import Link from "next/link";
import AuthService from "@/clientServices/AuthService";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "./constants";

const Password = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { email, password, name } = auth;

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, email: e.target.value });
  };
  const getLink = () => {
    setIsLoading(true);
    try {
      AuthService.forgot(email)
        .then(() => setMessage(SUCCESS_MESSAGE))
        .catch(() => {
          setMessage(ERROR_MESSAGE);
        });
    } catch (e) {
      setMessage(ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={`wrapper ${styles.wrapper}`}>
      <Button variant="outlined">
        <Link href={"/"}>Вернуться на главную</Link>
      </Button>
      {message ? (
        <>
          <span>{message}</span>
          {message === ERROR_MESSAGE && (
            <Button
              variant="contained"
              onClick={() => {
                setMessage("");
              }}
            >
              Попробовать ещё
            </Button>
          )}
        </>
      ) : (
        <>
          <span>
            Введите свой электронный адрес и мы отправим вам ссылку для
            восстановления доступа к аккаунту.
          </span>
          <TextField
            required
            label="Адрес электронной почты"
            defaultValue=""
            type="email"
            value={email}
            onChange={handleEmail}
            sx={{ width: "100%", maxWidth: "400px" }}
          />
          <Button variant="contained" onClick={getLink}>
            Получить ссылку для смены пароля
          </Button>
        </>
      )}

      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
};

export default Password;

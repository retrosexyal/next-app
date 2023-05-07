import React, { useEffect, useState } from "react";
import styles from "./login.module.scss";
import Button from "../button";
import AuthService from "@/clientServices/AuthService";

interface IProps {
  handleLogin: (event: React.MouseEvent) => void;
}

const Login: React.FC<IProps> = ({ handleLogin }) => {
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState("");

  const { email, password } = auth;

  const handleLog = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).getAttribute("data-id") === "close") {
      handleLogin(e);
    }
  };

  const sendLogin = () => {
    AuthService.login(email, password).then((res) => {
      if (res.status === 200) {
        console.log(res);
        localStorage.setItem("token", res.data.accessToken);
        setUser(res.data.user.email);
        setAuth({ email: "", password: "" });
        setIsLoading(false);
      } else if (res.status === 404) {
        setIsLoading(false);
        alert("пользователь отсутствует");
      }
    });
  };

  useEffect(() => {
    AuthService.refresh()
      .then(({ data }) => {
        setUser(data.user.email);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("use effect " + err);
        setIsLoading(false);
      });
  }, []);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, email: e.target.value });
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, password: e.target.value });
  };

  return (
    <div className={styles.wrapper} onClick={handleLog} data-id="close">
      <div className={styles.content}>
        {isLoading && <h2>Загрузка...</h2>}
        {user && (
          <h2>{`Пользователь с почтовым ящиком ${user} авторизирован`}</h2>
        )}
        {!isLoading && !user && (
          <>
            <label htmlFor="email_login" className={styles.label}>
              введите адрес электронной почты
              <input
                type="email"
                id="email_login"
                placeholder="email"
                value={email}
                onChange={handleEmail}
              />
            </label>
            <label htmlFor="pass_login" className={styles.label}>
              введите пароль
              <input
                type="password"
                id="pass_login"
                placeholder="password"
                value={password}
                onChange={handlePassword}
              />
            </label>
            <div>
              <Button text="Войти" onClick={sendLogin} />
              <Button text="Зарегистироваться" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Login;

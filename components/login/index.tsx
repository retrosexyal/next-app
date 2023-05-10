import React, { useEffect, useState } from "react";
import styles from "./login.module.scss";
import Button from "../button";
import AuthService from "@/clientServices/AuthService";
import Students from "../students";
import Link from "next/link";

interface IProps {
  handleLogin: (event: React.MouseEvent) => void;
}

const Login: React.FC<IProps> = ({ handleLogin }) => {
  const [auth, setAuth] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState("");
  const [isShow, setIsShow] = useState(false);

  const { email, password, name } = auth;

  const handleLog = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).getAttribute("data-id") === "close") {
      handleLogin(e);
    }
  };

  const sendLogin = () => {
    AuthService.login(email, password)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.accessToken);
          setUser(res.data.user.name);
          setAuth({ email: "", password: "", name: "" });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setIsLoading(false);
          alert("пользователь отсутствует");
        }
      });
  };

  useEffect(() => {
    AuthService.refresh()
      .then(({ data }) => {
        setUser(data.user.name);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, email: e.target.value });
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, password: e.target.value });
  };
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, name: e.target.value });
  };
  const handleLogout = () => {
    AuthService.logout();
    setUser("");
    setAuth({ name: "", email: "", password: "" });
  };
  const handleRegistr = () => {
    setIsShow(true);
    if (email && password && name) {
      AuthService.registration(email, password, name)
        .then(({ data }) => {
          setUser(data.user.name);
          setIsLoading(false);
          setIsShow(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setIsShow(true);
          alert("такой пользователь существует");
        });
    }
  };

  return (
    <div className={styles.wrapper} onClick={handleLog} data-id="close">
      <div className={styles.content}>
        {isLoading && <h2>Загрузка...</h2>}
        {user && (
          <>
            <h2>{`Добро пожаловать ${user}`}</h2>
            <Link className={styles.link} href="/settings">
              Перейти в личный кабинет
            </Link>
            <Button text="выйти" onClick={handleLogout} />
          </>
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
            {isShow && (
              <label htmlFor="name_login" className={styles.label}>
                введите ваше имя
                <input
                  type="text"
                  id="name_login"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={handleName}
                />
              </label>
            )}
            <div>
              {!isShow && <Button text="Войти" onClick={sendLogin} />}
              <Button text="Зарегистироваться" onClick={handleRegistr} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Login;

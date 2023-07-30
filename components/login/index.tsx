import React, { useEffect, useState } from "react";
import styles from "./login.module.scss";
import Button from "../button";
import AuthService from "@/clientServices/AuthService";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser as setUserApp } from "@/store/slices/userSlice";
import { Backdrop, CircularProgress } from "@mui/material";

interface IProps {
  handleLogin: (event: React.MouseEvent) => void;
}

const Login: React.FC<IProps> = ({ handleLogin }) => {
  const [auth, setAuth] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [checkPass, setCheckPass] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState("");
  const [isShow, setIsShow] = useState(false);

  const { user: userApp } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

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
          const userData = res.data.user;
          dispatch(setUserApp(userData));
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setIsLoading(false);
          alert("пользователь отсутствует либо неверный пароль");
        }
      });
  };
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    AuthService.refresh()
      .then(({ data }) => {
        setUser(data.user.name);
        setIsLoading(false);
        const userData = data.user;
        dispatch(setUserApp(userData));
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
  const handleCheckPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPass(e.target.value);
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
    if (email && password && name && password === checkPass) {
      AuthService.registration(email, password, name)
        .then(({ data }) => {
          setUser(data.user.name);
          setIsLoading(false);
          setIsShow(false);
          const userData = data.user;
          dispatch(setUserApp(userData));
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setIsShow(true);
          alert("такой пользователь существует");
        });
    } else if (checkPass) {
      if (checkPass.length < 8) {
        alert("пароль меньше 8 символов");
      } else {
        alert("пароли не совпадают");
      }
    }
  };

  return (
    <div className={styles.wrapper} onClick={handleLog} data-id="close">
      <div className={styles.content}>
        {isLoading && <h2>Загрузка...</h2>}
        {user && (
          <>
            <h2>{`Добро пожаловать ${user}`}</h2>
            {userApp.isActivated && (
              <Link className={styles.link} href="/settings">
                Перейти в личный кабинет
              </Link>
            )}
            {!userApp.isActivated && (
              <div>
                необходимо активировать учетную запись, посетите почтовый ящик и
                пройдите по ссылке
              </div>
            )}
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
                minLength={8}
              />
            </label>

            {isShow && (
              <>
                <label htmlFor="pass_check" className={styles.label}>
                  повторите пароль
                  <input
                    type="password"
                    id="pass_check"
                    placeholder="password"
                    value={checkPass}
                    onChange={handleCheckPass}
                  />
                </label>
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
              </>
            )}
            <div className={styles.btn_container}>
              {!isShow && <Button text="Войти" onClick={sendLogin} />}
              <Button text="Зарегистироваться" onClick={handleRegistr} />
            </div>
          </>
        )}
      </div>
      {/* {isShow && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isShow}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )} */}
    </div>
  );
};
export default Login;

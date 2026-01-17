import React, { useEffect, useState } from "react";
import styles from "./login.module.scss";
import Button from "../button";
import AuthService from "@/clientServices/AuthService";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser as setUserApp } from "@/store/slices/userSlice";
import {
  Backdrop,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";

interface IProps {
  handleLogin: (event?: React.MouseEvent) => void;
}

const Login: React.FC<IProps> = ({ handleLogin }) => {
  const router = useRouter();
  const [auth, setAuth] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [checkPass, setCheckPass] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isValidPass, setIsValidPass] = useState(false);
  const [isValidCheckPass, setIsValidCheckPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user: userApp } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const { email, password, name } = auth;

  const handleLog = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).getAttribute("data-id") === "close") {
      handleLogin(e);
    }
  };

  const sendLogin = () => {
    setIsLoading(true);
    AuthService.login(email, password)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.accessToken);
          setUser(res.data.user.name);
          setAuth({ email: "", password: "", name: "" });
          setIsLoading(false);
          const userData = res.data.user;
          dispatch(setUserApp(userData));
          handleLogin();
          router.push("/settings");
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
    const token = localStorage.getItem("token");
    if (token) {
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
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, email: e.target.value });
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, password: e.target.value });
    if (password.length < 7) {
      setIsValidPass(false);
    } else {
      setIsValidPass(true);
    }
  };
  const handleCheckPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPass(e.target.value);
    if (password === checkPass) {
      setIsValidCheckPass(true);
    } else {
      setIsValidCheckPass(false);
    }
  };
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, name: e.target.value });
  };
  const handleLogout = () => {
    localStorage.setItem("token", "");
    AuthService.logout();
    setUser("");
    setAuth({ name: "", email: "", password: "" });
  };
  const handleRegistr = () => {
    setIsShow(true);
    if (email && password && name && password === checkPass) {
      setIsLoading(true);
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

  const handlePassBlur = () => {
    if (password.length < 8) {
      setIsValidPass(false);
    } else {
      setIsValidPass(true);
    }
  };
  const handleCheckPassBlur = () => {
    if (password === checkPass) {
      setIsValidCheckPass(true);
    } else {
      setIsValidCheckPass(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <div className={styles.wrapper} onClick={handleLog} data-id="close">
      <div className={styles.content}>
        <IconButton
          aria-label="close"
          data-id="close"
          onClick={handleLogin}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon data-id="close" />
        </IconButton>
        {isLoading && <h2>Загрузка...</h2>}
        {user && (
          <>
            <h2>{`Добро пожаловать ${user}`}</h2>
            {userApp.isActivated && (
              <Link
                className={styles.link}
                href="/settings"
                onClick={handleLogin}
              >
                Перейти в личный кабинет
              </Link>
            )}
            {!userApp.isActivated && (
              <div>
                Необходимо активировать учетную запись, посетите почтовый ящик{" "}
                <span style={{ fontWeight: 800 }}>{userApp.email}</span> и
                пройдите по ссылке
              </div>
            )}
            <Button text="выйти из учётной записи" onClick={handleLogout} />
            <Link
              href="/password/change"
              className={styles.link_forgot_pass}
              onClick={handleLogin}
            >
              Сменить пароль
            </Link>
          </>
        )}

        {!isLoading && !user && (
          <>
            <TextField
              required
              label="Адрес электронной почты"
              defaultValue=""
              type="email"
              value={email}
              onChange={handleEmail}
              sx={{ width: "100%", maxWidth: "400px" }}
            />

            <TextField
              error={!isValidPass}
              required
              label="введите пароль"
              defaultValue=""
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePassword}
              sx={{ width: "100%", maxWidth: "400px" }}
              onBlur={handlePassBlur}
              helperText={!isValidPass ? "Минимум 8 символов" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {isShow && (
              <>
                <TextField
                  sx={{ width: "100%", maxWidth: "400px" }}
                  error={!isValidCheckPass}
                  required
                  label="повторите пароль"
                  defaultValue=""
                  type={showPassword ? "text" : "password"}
                  value={checkPass}
                  onChange={handleCheckPass}
                  onBlur={handleCheckPassBlur}
                  helperText={!isValidCheckPass ? "Пароли не совпадают" : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  sx={{ width: "100%", maxWidth: "400px" }}
                  required
                  label="Введите имя"
                  defaultValue=""
                  type="text"
                  value={name}
                  onChange={handleName}
                />
              </>
            )}
            <div className={styles.btn_container}>
              {!isShow && <Button text="Войти" onClick={sendLogin} />}
              <Button text="Зарегистироваться" onClick={handleRegistr} />
              <Link
                href="/password"
                className={styles.link_forgot_pass}
                onClick={handleLogin}
              >
                Забыли пароль?
              </Link>
              <Link
                href="/password/change"
                className={styles.link_forgot_pass}
                onClick={handleLogin}
              >
                Сменить пароль
              </Link>
            </div>
          </>
        )}
      </div>
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
export default Login;

import React, { useEffect, useState } from "react";
import styles from "./login.module.scss";
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
  Dialog,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import ActivationNotice from "@/components/activation-notice";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

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
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmationTouched, setConfirmationTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user: userApp } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const { email, password, name } = auth;
  const passwordError = isShow && passwordTouched && password.length < 8;
  const confirmationError = confirmationTouched && checkPass !== password;

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
          if (userData.isActivated) {
            handleLogin();
            router.push("/settings");
          }
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
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
          localStorage.setItem("token", data.accessToken);
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
  };
  const handleCheckPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPass(e.target.value);
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
    if (!isShow) {
      setIsShow(true);
      setPasswordTouched(false);
      setConfirmationTouched(false);
      return;
    }
    setPasswordTouched(true);
    setConfirmationTouched(true);
    if (email && password.length >= 8 && name && password === checkPass) {
      setIsLoading(true);
      AuthService.registration(email, password, name)
        .then(({ data }) => {
          localStorage.setItem("token", data.accessToken);
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Dialog open onClose={() => handleLogin()} aria-labelledby="auth-dialog-title"
      maxWidth={false} PaperProps={{ className: styles.content }}
      BackdropProps={{ sx: { backgroundColor: "rgba(24, 30, 43, 0.48)", backdropFilter: "blur(5px)" } }}>
        <IconButton
          aria-label="Закрыть окно"
          data-id="close"
          onClick={handleLogin}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            width: 40,
            height: 40,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon data-id="close" />
        </IconButton>
        {isLoading && <h2>Загрузка...</h2>}
        {user && (
          <>
            <header className={styles.heading}>
              <div className={styles.icon}>{userApp.isActivated ? <PersonOutlineRoundedIcon /> : <MarkEmailUnreadOutlinedIcon />}</div>
              <h2 id="auth-dialog-title">{userApp.isActivated ? `С возвращением, ${user}!` : "Подтвердите почту"}</h2>
              <p>{userApp.isActivated ? "Всё готово для перехода в личный кабинет." : `${user}, остался один шаг до личного кабинета.`}</p>
            </header>
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
              <ActivationNotice email={userApp.email} onActivated={handleLogin} />
            )}
            <footer className={styles.account_actions}>
            <button type="button" className={styles.logout} onClick={handleLogout}>Выйти из аккаунта</button>
            <Link
              href="/password/change"
              className={styles.link_forgot_pass}
              onClick={handleLogin}
            >
              Сменить пароль
            </Link>
            </footer>
          </>
        )}

        {!isLoading && !user && (
          <>
            <header className={styles.heading}>
              <h2 id="auth-dialog-title">{isShow ? "Создать аккаунт" : "Рады вас видеть"}</h2>
              <p>{isShow ? "Зарегистрируйтесь, чтобы продолжить." : "Войдите в личный кабинет ЛиМи."}</p>
            </header>
            <TextField
              className={styles.field}
              InputLabelProps={{ shrink: true }}
              required
              id="auth-email"
              name="email"
              autoComplete="email"
              placeholder="name@example.com"
              inputProps={{ inputMode: "email", autoCapitalize: "none", spellCheck: false }}
              label="Электронная почта"

              type="email"
              value={email}
              onChange={handleEmail}
              sx={{ width: "100%", maxWidth: "400px" }}
            />

            <TextField
              className={styles.field}
              InputLabelProps={{ shrink: true }}
              error={passwordError}
              required
              id="auth-password"
              name="password"
              autoComplete={isShow ? "new-password" : "current-password"}
              placeholder={isShow ? "Минимум 8 символов" : "Введите пароль"}
              label="Пароль"

              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePassword}
              sx={{ width: "100%", maxWidth: "400px" }}
              onBlur={() => setPasswordTouched(true)}
              helperText={passwordError ? "Используйте не менее 8 символов" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                      aria-pressed={showPassword}
                      onMouseDown={(event) => event.preventDefault()}
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
              className={styles.field}
              InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%", maxWidth: "400px" }}
                  error={confirmationError}
                  required
                  id="auth-password-confirm"
                  name="passwordConfirmation"
                  autoComplete="new-password"
                  placeholder="Введите пароль ещё раз"
                  label="Повторите пароль"

                  type={showPassword ? "text" : "password"}
                  value={checkPass}
                  onChange={handleCheckPass}
                  onBlur={() => setConfirmationTouched(true)}
                  helperText={confirmationError ? "Пароли не совпадают" : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                      aria-pressed={showPassword}
                      onMouseDown={(event) => event.preventDefault()}
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
              className={styles.field}
              InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%", maxWidth: "400px" }}
                  required
                  id="auth-name"
                  name="name"
                  autoComplete="given-name"
                  placeholder="Как к вам обращаться"
                  label="Ваше имя"

                  type="text"
                  value={name}
                  onChange={handleName}
                />
              </>
            )}
            <div className={styles.btn_container}>
              {!isShow && <Button className={styles.primary} variant="contained" disableElevation onClick={sendLogin}>Войти</Button>}
              <Button className={isShow ? styles.primary : styles.secondary} variant={isShow ? "contained" : "outlined"} disableElevation onClick={handleRegistr}>Создать аккаунт</Button>
              {isShow && <Button className={styles.secondary} onClick={() => setIsShow(false)}>Уже есть аккаунт? Войти</Button>}
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
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Dialog>
  );
};
export default Login;

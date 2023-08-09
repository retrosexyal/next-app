import React, { useState } from "react";
import styles from "./settings.module.scss";
import { useRouter } from "next/router";

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import AuthService from "@/clientServices/AuthService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PasswordInput } from "@/components/inputs/password-input";

const Change = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidPass, setIsValidPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [repitPass, setRepitPass] = useState("");
  const [auth, setAuth] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { email, password } = auth;
  const router = useRouter();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, email: e.target.value });
  };
  const getLink = () => {
    setIsLoading(true);
    try {
      if (newPass === repitPass) {
        AuthService.change(email, password, newPass).then(() =>
          setIsModalOpen(true)
        );
      } else {
        alert("пароли не совпадают");
      }
    } catch (e) {
      alert(
        "что-то пошло не так, попробуйте позже либо обратитесь к своему хореографу за помощью"
      );
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, password: e.target.value });
    if (password.length < 7) {
      setIsValidPass(false);
    } else {
      setIsValidPass(true);
    }
  };
  const handlePassBlur = () => {
    if (password.length < 8) {
      setIsValidPass(false);
    } else {
      setIsValidPass(true);
    }
  };
  const handleClose = () => {
    setIsModalOpen(false);
    router.push("/");
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <div className={`wrapper ${styles.wrapper}`}>
      <Button variant="outlined">
        <Link href={"/"}>Вернуться на главную</Link>
      </Button>
      <span>
        Для смены пароля необходимо ввести старый пароль(либо пароль полученный
        по электронной почте, при восстановлении пароля)
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
      <TextField
        error={!isValidPass}
        required
        label="введите старый пароль"
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
      <PasswordInput
        text="Введите новый пароль"
        value={newPass}
        setValue={setNewPass}
      />
      <PasswordInput
        text="Повторите новый пароль"
        value={repitPass}
        setValue={setRepitPass}
      />
      <Button variant="contained" onClick={getLink}>
        Сменить пароль
      </Button>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <>
        <Modal
          open={isModalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "50vw",
              height: "50vh",
              bgcolor: "white",
              display: "flex",
              justifyContent: "center",
              position: "fixed",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              пароль успешно изменён
            </Typography>
          </Box>
        </Modal>
      </>
    </div>
  );
};

export default Change;

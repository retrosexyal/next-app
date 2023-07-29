import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import styles from "./form.module.scss";
import { IInfo } from "@/interface/iContact";
import AuthService from "@/clientServices/AuthService";

export const FormSend = () => {
  const [isSending, setIsSending] = useState(false);
  const [isFinish, setIsFinish] = useState("");
  const [info, setInfo] = useState<IInfo>({
    FIOP: "",
    FIOC: "",
    dateB: "",
    desiases: "отсутствуют",
    place: "",
    KB: "",
    datePass: "",
    whoPass: "",
    phone: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);

  const { FIOP, FIOC, dateB, place, KB, datePass, whoPass, phone, desiases } =
    info;
  useEffect(() => {
    if (FIOP && dateB && place && phone) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [FIOP, dateB, place, phone]);

  const handleSubmit = async () => {
    setIsSending(true);
    try {
      const res = await AuthService.registerForm(info);
      const loadingMessage = await res.data.message;
      if (loadingMessage === "письмо отправлено") {
        setIsSending(false);
        setInfo({ ...info, FIOP: "", dateB: "", place: "", phone: "" });
        setIsFinish("done");
      } else {
        setIsFinish("err");
      }
    } catch (e) {
      console.log(e);
      setIsFinish("err");
    }
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

  return (
    <div className={styles.wrapper}>
      <form className={styles.form_wrapper}>
        {isFinish === "" && (
          <>
            <TextField
              required
              id="outlined-basic"
              label="Ф.И.О. родителя"
              variant="outlined"
              value={info.FIOP}
              onChange={(e) => setInfo({ ...info, FIOP: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Зал где Вы хотите заниматься
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={info.place}
                label="Зал где вы занимаетесь"
                onChange={(e) => setInfo({ ...info, place: e.target.value })}
              >
                <MenuItem value={"ФОК Орловского"}>ФОК Орловского</MenuItem>
                <MenuItem value={"ФОК Златоустовкого"}>
                  ФОК Златоустовкого
                </MenuItem>
                <MenuItem value={"Дворец гимнастики"}>
                  Дворец гимнастики
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              id="outlined-basic"
              label="Телефон"
              variant="outlined"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
            />
            <TextField
              id="outlined-basic"
              label="Сколько лет ребёнку"
              variant="outlined"
              value={info.dateB}
              onChange={(e) => setInfo({ ...info, dateB: e.target.value })}
            />
            <Button
              variant="outlined"
              disabled={isDisabled}
              onClick={handleSubmit}
            >
              Оставить заявку
            </Button>{" "}
          </>
        )}
        {isFinish === "done" && (
          <>
            <h2>Сообщение успешно отправлено</h2>
            <h3>С Вами скоро свяжутся для уточнения информации</h3>
          </>
        )}
        {isFinish === "err" && (
          <>
            <h2>Что-то пошло не то</h2>
            <h3>
              Попробуйте позже либо позвоните по телефону +375 29 1 999 231
            </h3>
          </>
        )}
      </form>
      <div>
        {isSending && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isSending}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </div>
    </div>
  );
};

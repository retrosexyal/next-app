import React, { useEffect, useState } from "react";
import styles from "./contract.module.scss";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { ContractList } from "../contract-list";
import Popup from "../popup";
import { IInfo } from "@/interface/iContact";

export const Contract = () => {
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
  const [showList, setShowList] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const {
    FIOP,
    FIOC,
    dateB,
    place,

    KB,
    datePass,
    whoPass,
    phone,
    desiases,
  } = info;
  useEffect(() => {
    if (
      FIOP &&
      FIOC &&
      dateB &&
      place &&
      KB &&
      datePass &&
      whoPass &&
      phone &&
      desiases
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [info]);

  const handleSubmit = () => {
    setShowList(true);
  };
  const handleClose = () => {
    setShowList(false);
  };
  return (
    <div>
      <form className={styles.form_wrapper}>
        <TextField
          id="outlined-basic"
          label="Ф.И.О. родителя"
          variant="outlined"
          value={info.FIOP}
          onChange={(e) => setInfo({ ...info, FIOP: e.target.value })}
        />

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Зал где вы занимаетесь
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={info.place}
            label="Зал где вы занимаетесь"
            onChange={(e) => setInfo({ ...info, place: e.target.value })}
          >
            <MenuItem value={"ФОК Орловского"}>ФОК Орловского</MenuItem>
            <MenuItem value={"ФОК Златоустовкого"}>ФОК Златоустовкого</MenuItem>
            <MenuItem value={"Дворец гимнастики"}>Дворец гимнастики</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="outlined-basic"
          label="Серия паспорта"
          variant="outlined"
          value={info.KB}
          onChange={(e) => setInfo({ ...info, KB: e.target.value })}
        />
        <TextField
          id="outlined-basic"
          label="Когда выдан"
          variant="outlined"
          value={info.datePass}
          onChange={(e) => setInfo({ ...info, datePass: e.target.value })}
        />
        <TextField
          id="outlined-basic"
          label="Кем выдан"
          variant="outlined"
          value={info.whoPass}
          onChange={(e) => setInfo({ ...info, whoPass: e.target.value })}
        />
        <TextField
          id="outlined-basic"
          label="Телефон"
          variant="outlined"
          value={info.phone}
          onChange={(e) => setInfo({ ...info, phone: e.target.value })}
        />
        <TextField
          id="outlined-basic"
          label="Ф.И.О. ребёнка"
          variant="outlined"
          value={info.FIOC}
          onChange={(e) => setInfo({ ...info, FIOC: e.target.value })}
        />
        <TextField
          id="outlined-basic"
          label="Дата рождения ребёнка"
          variant="outlined"
          value={info.dateB}
          onChange={(e) => setInfo({ ...info, dateB: e.target.value })}
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          id="outlined-basic"
          label="Хронические заболевания ребёнка"
          variant="outlined"
          value={info.desiases}
          onChange={(e) => setInfo({ ...info, desiases: e.target.value })}
        />
        <Button variant="outlined" disabled={isDisabled} onClick={handleSubmit}>
          Предварительный просмотр
        </Button>
      </form>

      <Modal
        open={showList}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            bgcolor: "white",
            display: "flex",
            justifyContent: "center",
            position: "fixed",
          }}
        >
          <button
            onClick={handleClose}
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            close
          </button>
          <ContractList info={info} />
        </Box>
      </Modal>
    </div>
  );
};

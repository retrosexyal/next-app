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
import ContractService from "@/clientServices/ContractService";

import { IInfo } from "@/interface/iContact";
import { useAppSelector } from "@/store";

export const Contract = () => {
  const [info, setInfo] = useState<IInfo>({
    FIOP: "",
    FIOC: "",
    dateB: "",
    desiases: "",
    place: "",
    KB: "",
    datePass: "",
    whoPass: "",
    phone: "",
    sex: "мою дочь",
    address: "",
  });
  const [showList, setShowList] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isStyled, setIsStyled] = useState(false);
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
    sex,
    address,
  } = info;

  const { id } = useAppSelector((state) => state.user.user);

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
      desiases &&
      sex &&
      address
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [info]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ContractService.getContract(id);
        const data = response.data;
        if (!data) {
          return;
        }

        setInfo({
          FIOP: data.parentName,
          place: data.place,
          KB: data.KB,
          datePass: data.pasportDate,
          whoPass: data.pasportPlace,
          phone: data.phone,
          FIOC: data.childrenName,
          dateB: data.birthday,
          desiases: data.diseases,
          address: data.address,
          sex: data.sex,
        });
      } catch (error) {
        console.error(error);
      }
    };
    setTimeout(() => {
      setIsStyled(true);
      fetchData();
    }, 500);
  }, []);

  const handleSubmit = () => {
    setShowList(true);
  };
  const handleClose = () => {
    setShowList(false);
  };

  return (
    <>
      <form className={styles.form_wrapper} id="form-for-contract">
        <TextField
          id="outlined-basic1"
          label="Ф.И.О. родителя"
          variant="outlined"
          value={info.FIOP}
          onChange={(e) => setInfo({ ...info, FIOP: e.target.value })}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          InputLabelProps={{
            style: { color: "black  !important" },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Зал где вы занимаетесь
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={info.place || ""}
            label="Зал где вы занимаетесь"
            onChange={(e) => setInfo({ ...info, place: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "black  !important",
              },
              "& .MuiOutlinedInput-input": {
                color: "black  !important",
              },
            }}
            style={
              isStyled
                ? {
                    background: "wheat",
                  }
                : {}
            }
          >
            <MenuItem value={"ФОК Орловского"}>ФОК Орловского</MenuItem>
            <MenuItem value={"ФОК Златоустовкого"}>ФОК Златоустовкого</MenuItem>
            <MenuItem value={"Дворец гимнастики"}>Дворец гимнастики</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Пол ребёнка</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={info.sex}
            label="Пол ребёнка"
            onChange={(e) => {
              console.log(e.target.value);

              setInfo({ ...info, sex: e.target.value });
            }}
            sx={{
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "black  !important",
              },
              "& .MuiOutlinedInput-input": {
                color: "black  !important",
              },
            }}
            style={
              isStyled
                ? {
                    background: "wheat",
                  }
                : {}
            }
          >
            <MenuItem value={"мою дочь"}>Девочка</MenuItem>
            <MenuItem value={"моего сына"}>Мальчик</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="outlined-basic2"
          label="Номер паспорта(в формате KB111111111)"
          variant="outlined"
          value={info.KB}
          onChange={(e) => setInfo({ ...info, KB: e.target.value })}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          InputLabelProps={{
            style: { color: "black  !important" },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
        />
        <TextField
          id="outlined-basic3"
          label="Когда выдан"
          variant="outlined"
          value={info.datePass}
          onChange={(e) => setInfo({ ...info, datePass: e.target.value })}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          InputLabelProps={{
            style: { color: "black  !important" },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
        />
        <TextField
          id="outlined-basic4"
          label="Кем выдан"
          variant="outlined"
          value={info.whoPass}
          onChange={(e) => setInfo({ ...info, whoPass: e.target.value })}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          InputLabelProps={{
            style: { color: "black  !important" },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
        />
        <TextField
          id="outlined-basic5"
          label="Телефон"
          variant="outlined"
          value={info.phone}
          onChange={(e) => setInfo({ ...info, phone: e.target.value })}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          InputLabelProps={{
            style: { color: "black  !important" },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
        />
        <TextField
          id="outlined-basic6"
          label="Ф.И.О. ребёнка"
          variant="outlined"
          value={info.FIOC}
          onChange={(e) => setInfo({ ...info, FIOC: e.target.value })}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          InputLabelProps={{
            style: { color: "black  !important" },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
        />
        <TextField
          id="outlined-basic7"
          label="Дата рождения ребёнка"
          variant="outlined"
          value={info.dateB}
          onChange={(e) => setInfo({ ...info, dateB: e.target.value })}
          type="date"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
        />
        <TextField
          id="outlined-basic8"
          label="Хронические заболевания ребёнка"
          variant="outlined"
          value={info.desiases}
          onChange={(e) => setInfo({ ...info, desiases: e.target.value })}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          InputLabelProps={{
            style: { color: "black  !important" },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
        />
        <TextField
          id="outlined-basic8"
          label="Адрес проживания"
          variant="outlined"
          value={info.address}
          onChange={(e) => setInfo({ ...info, address: e.target.value })}
          InputProps={{
            style: {
              borderColor: "black  !important",
              background: "wheat  !important",
              color: "black  !important",
            },
          }}
          InputLabelProps={{
            style: { color: "black  !important" },
          }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "black  !important",
            },
            "& .MuiOutlinedInput-input": {
              color: "black  !important",
            },
          }}
          style={
            isStyled
              ? {
                  background: "wheat",
                }
              : {}
          }
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
            style={{
              position: "absolute",
              top: 0,
              right: "15px",
              backgroundColor: "#d01f1f",
              color: "white",
              padding: "2px",
              borderRadius: "10px",
            }}
          >
            редактировать
          </button>
          <ContractList info={info} />
        </Box>
      </Modal>
    </>
  );
};

import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./contract.module.scss";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ContractList } from "../contract-list";
import ContractService from "@/clientServices/ContractService";

import { IContract } from "@/interface/iContact";
import { useAppSelector } from "@/store";
import { INPUTS, REQUIRED_FIELDS } from "./constants";
import { ContractProps } from "./models";

export const Contract = ({ info, setInfo }: ContractProps) => {
  const [selectedInfoId, setSelectedInfoId] = useState<string | null>(null);

  const handleOpenInfo = (infoId: string) => () => {
    setSelectedInfoId(infoId);
  };
  const handleClose = () => {
    setSelectedInfoId(null);
  };

  const handleChangeValue =
    (currentId: string, key: string) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setInfo((prev) =>
        prev.map((prevInfo) => {
          if (prevInfo["_id"] !== currentId) {
            return prevInfo;
          }

          return { ...prevInfo, [key as keyof IContract]: value };
        }),
      );
    };

  const handleSelectValue =
    (currentId: string, key: string) =>
    ({ target: { value } }: SelectChangeEvent<HTMLInputElement>) => {
      setInfo((prev) =>
        prev.map((prevInfo) => {
          if (prevInfo["_id"] !== currentId) {
            return prevInfo;
          }

          return { ...prevInfo, [key as keyof IContract]: value };
        }),
      );
    };

  const toInputDate = (date: string): string => {
    if (!date || !date.includes(".")) {
      return date;
    }

    const [day, month, year] = date.split(".");
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
  };

  const selectedInfo = [info].find(({ _id }) => _id === selectedInfoId);

  return (
    <>
      {[info].map((infoProps, indKey) => {
        const { _id } = infoProps;

        return (
          <form
            className={styles.form_wrapper}
            id={`"form-for-contract"__${_id}_${indKey}`}
            key={`${_id}${indKey}`}
          >
            {INPUTS.map(({ key, label, items }, ind) => {
              const val = infoProps[key as keyof IContract];

              if (items) {
                return (
                  <FormControl fullWidth key={`${label}${ind}`}>
                    <InputLabel id={label}>{label}</InputLabel>
                    <Select
                      labelId={label}
                      required
                      id={`${label}_`}
                      value={(val as undefined) || ""}
                      label="Зал где вы занимаетесь"
                      onChange={handleSelectValue(_id, key)}
                      sx={{
                        backgroundColor: "#fff",
                        color: "#000",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#000",
                        },
                      }}
                    >
                      {items.map(({ label, value }, ind) => (
                        <MenuItem value={value} key={`${value}${label}${ind}`}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              const isDate = key === "birthday";

              return (
                <TextField
                  key={`${label}${ind}`}
                  label={label}
                  variant="outlined"
                  value={isDate ? toInputDate(val as string) : val}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type={isDate ? "date" : undefined}
                  onChange={handleChangeValue(_id, key)}
                  sx={{
                    "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(0)",
                      opacity: 1,
                      cursor: "pointer",
                    },
                  }}
                />
              );
            })}
            <Button
              variant="outlined"
              disabled={
                !REQUIRED_FIELDS.every(
                  (field) => !!infoProps[field as keyof IContract] === true,
                )
              }
              onClick={handleOpenInfo(_id)}
            >
              Предварительный просмотр
            </Button>
          </form>
        );
      })}

      <Modal
        open={selectedInfoId !== null}
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
          {selectedInfo && <ContractList info={selectedInfo} />}
        </Box>
      </Modal>
    </>
  );
};

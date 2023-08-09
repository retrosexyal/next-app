import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

interface IProps {
  value: string;
  text: string;
  setValue: (e: string) => void;
}

export const PasswordInput: React.FC<IProps> = ({ value, text, setValue }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isValidPass, setIsValidPass] = useState(false);
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setValue(newPassword);
    if (value.length < 7) {
      setIsValidPass(false);
    } else {
      setIsValidPass(true);
    }
  };
  const handlePassBlur = () => {
    if (value.length < 8) {
      setIsValidPass(false);
    } else {
      setIsValidPass(true);
    }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <TextField
      error={!isValidPass}
      required
      label={text}
      defaultValue=""
      type={showPassword ? "text" : "password"}
      value={value}
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
  );
};

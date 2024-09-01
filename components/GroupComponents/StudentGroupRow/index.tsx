import { Checkbox, Stack, Typography } from "@mui/material";
import { StudentGroupRowProps } from "./models";
import { useState } from "react";

export function StudentGroupRow({ student, onSelect,selectStatus }: StudentGroupRowProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    onSelect(student)();
    setIsChecked(!isChecked);
  };
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography>{student.name}</Typography>
      <Checkbox onChange={handleChange} checked={selectStatus ?? isChecked} />
    </Stack>
  );
}

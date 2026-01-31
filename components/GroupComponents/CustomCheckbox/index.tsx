import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import type { CustomCheckboxType } from "./models";

export const CustomCheckbox = ({
  currentField,
  currentStudent,
  setStudent,
  students,
}: CustomCheckboxType) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isChecked) {
      setStudent((prev) => {
        if (
          prev.find(
            ({ student: { name } }) => name === currentStudent.name
          )
        ) {
          return prev.map(({ mark, student }) =>
            student.name === currentStudent.name
              ? { student, mark: currentField }
              : { student, mark }
          );
        } else {
          return [...prev, { student: currentStudent, mark: currentField }];
        }
      });
    }

    if (!isChecked) {
      setStudent((prev) => {
        if (
          prev.find(
            ({ student, mark }) =>
              student.name === currentStudent.name && mark === currentField
          )
        ) {
          return prev.filter(({ student }) => student.name !== currentStudent.name);
        }
        return prev;
      });
    }
  }, [isChecked]);

  useEffect(() => {
    const stateStudent = students.find(
      ({ student }) => student.name === currentStudent.name
    );

    if (
      stateStudent?.mark !== currentField &&
      stateStudent?.student.name === currentStudent.name &&
      isChecked
    ) {
      setIsChecked(false);
    }
  }, [students]);

  useEffect(() => {
    const stateStudent = students.find(
      ({ student }) => student === currentStudent
    );

    if (
      stateStudent?.mark === currentField &&
      stateStudent?.student.name === currentStudent.name
    ) {
      setIsChecked(true);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return <Checkbox checked={isChecked} onChange={handleChange} />;
};

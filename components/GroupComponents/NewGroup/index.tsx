import { Button, Stack } from "@mui/material";
import { StudentGroupRow } from "../StudentGroupRow";
import { NewGroupProps } from "./models";
import { IStudent } from "@/clientModels/IStudent";
import { useState } from "react";
import GroupService from "@/clientServices/GroupService";
import { StudentGroupType } from "@/clientModels/IGroup";

export function NewGroup({ students, handleDelete, groupName }: NewGroupProps) {
  const [selectedStudent, setSelectedStudent] = useState<IStudent>();
  const handleSelect = (student: IStudent) => () => {
    setSelectedStudent((prev) =>
      prev?.name === student.name ? undefined : student
    );
  };

  const handleCreate = () => {
    if (!groupName || !students) {
      return;
    }
    const studentsArr = students.map((student) => ({
      student: student,
    }));

    GroupService.createGroup({ name: groupName, students: studentsArr })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {students.map((student) => (
        <StudentGroupRow
          student={student}
          onSelect={handleSelect}
          key={student.name}
          selectStatus={selectedStudent?.name === student.name}
        />
      ))}
      {students.length > 0 && (
        <Stack gap={1}>
          {selectedStudent && (
            <Button variant="contained" onClick={handleDelete(selectedStudent)}>
              Удалить
            </Button>
          )}
          <Button variant="contained" onClick={handleCreate}>
            Создать группу
          </Button>
        </Stack>
      )}
    </>
  );
}

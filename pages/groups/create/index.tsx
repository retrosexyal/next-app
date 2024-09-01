import { IStudent } from "@/clientModels/IStudent";
import { NewGroup } from "@/components/GroupComponents/NewGroup";
import { StudentGroupRow } from "@/components/GroupComponents/StudentGroupRow";
import { debounce } from "@/helpers/debounce";
import { useCheckAdmin } from "@/hooks/useCheckAdmin";
import { useGetStudents } from "@/hooks/useGetStudents";
import { Box, Button, Container, Stack, TextField } from "@mui/material";
import React, { ChangeEvent, useCallback, useState } from "react";

function Create() {
  const [currentStudent, setCurrentStudent] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [newGroupStudents, setNewGroupStudents] = useState<IStudent[]>([]);
  const [groupName, setGroupName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<IStudent>();
  const isAdmin = useCheckAdmin();
  const students: IStudent[] | undefined = useGetStudents();

  const debouncedLog = useCallback(
    debounce((value: string) => {
      if (students) {
        setFilteredStudents(
          (students as IStudent[]).filter(({ name }) =>
            name.toLowerCase().match(value.toLowerCase())
          )
        );
      }
    }, 600),
    [students]
  );

  const handleStudent = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentStudent(value);
    debouncedLog(value);
  };

  const handleSelect = (student: IStudent) => () => {
    setSelectedStudent(student);
  };

  const handleAdd = () => {
    if (selectedStudent) {
      setNewGroupStudents((prev) => {
        const isAdded = prev.find(({ name }) => name === selectedStudent.name);
        if (isAdded) {
          return prev;
        }

        return [...prev, selectedStudent];
      });
    }
    if (filteredStudents.length > 0) {
      setFilteredStudents([]);
    }
    setCurrentStudent("");
  };

  const handleDeleteStudent = (student?: IStudent) => () => {
    setNewGroupStudents((prev) => {
      return prev.filter(({ name }) => name !== student?.name);
    });
  };

  const handleGroupName = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  return isAdmin ? (
    <Container>
      <Box
        component="section"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <TextField
          label="название группы"
          variant="standard"
          fullWidth
          value={groupName}
          onChange={handleGroupName}
        />
        <TextField
          label="найти или добавить нового"
          variant="filled"
          fullWidth
          value={currentStudent}
          onChange={handleStudent}
        />
        <Stack alignItems="center">
          {filteredStudents?.length > 0
            ? null
            : currentStudent && (
                <StudentGroupRow
                  student={{
                    name: currentStudent,
                    date: "",
                    _id: "",
                    mentor: "",
                    place: "",
                    group: "",
                    isHaveContract: false,
                  }}
                  onSelect={handleSelect}
                />
              )}
          {currentStudent &&
            filteredStudents.map((student) => (
              <StudentGroupRow
                student={student}
                onSelect={handleSelect}
                key={student._id}
              />
            ))}
          {currentStudent && (
            <Button
              variant="contained"
              onClick={handleAdd}
              sx={{ marginBottom: "20px" }}
            >
              Добавить
            </Button>
          )}
          <NewGroup
            students={newGroupStudents}
            handleDelete={handleDeleteStudent}
            groupName={groupName}
          />
        </Stack>
      </Box>
    </Container>
  ) : (
    <div>not admin</div>
  );
}

export default Create;

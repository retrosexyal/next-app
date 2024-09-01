import { useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Button, Container, FormControl, Stack } from "@mui/material";
import { groups } from "./constants";
import { useAppSelector } from "@/store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CustomCheckbox } from "@/components/GroupComponents/CustomCheckbox";
import Link from "next/link";
import { CustomCell } from "@/components/GroupComponents/CustomCell";
import { MarkProps, StudentGroupType } from "@/clientModels/IGroup";

function Groups() {
  const { email } = useAppSelector((state) => state.user.user);

  const [group, setGroup] = useState(groups[0].value);
  const [students, setStudents] = useState<StudentGroupType[]>([]);

  const handleChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value);
  };

  const currentData = new Date().toLocaleDateString();

  useEffect(() => {
    console.log(students);
  }, [students]);

  if (email !== "admin@admin") {
    return <div>нет доступа</div>;
  }

  const columns: GridColDef[] = [
    {
      field: "student",
      headerName: "Ученик",
      width: 130,
      renderCell: ({ row }) => <CustomCell>{row.student.name}</CustomCell>,
    },
    {
      field: "single",
      headerName: "Разовое",
      width: 65,
      headerClassName: "header-title",
      renderCell: ({ row, colDef }) => (
        <CustomCheckbox
          currentField={colDef.field as MarkProps}
          currentStudent={row.student}
          setStudent={setStudents}
          students={students}
        />
      ),
    },
    {
      field: "subscription",
      headerName: "Абонимент",
      width: 65,
      headerClassName: "header-title",
      renderCell: ({ row, colDef }) => (
        <CustomCheckbox
          currentField={colDef.field as MarkProps}
          currentStudent={row.student}
          setStudent={setStudents}
          students={students}
        />
      ),
    },
    {
      field: "documentation",
      headerName: "Справка",
      width: 65,
      headerClassName: "header-title",
      renderCell: ({ row, colDef }) => (
        <CustomCheckbox
          currentField={colDef.field as MarkProps}
          currentStudent={row.student}
          setStudent={setStudents}
          students={students}
        />
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      student: {
        name: "1",
        date: "",
        _id: "",
        mentor: "",
        place: "",
        group: "",
      },
    },
    {
      id: 2,
      student: {
        name: "w",
        date: "",
        _id: "",
        mentor: "",
        place: "",
        group: "",
      },
    },
    {
      id: 3,
      student: {
        name: "3",
        date: "",
        _id: "",
        mentor: "",
        place: "",
        group: "",
      },
    },
    {
      id: 4,
      student: {
        name: "4",
        date: "",
        _id: "",
        mentor: "",
        place: "",
        group: "",
      },
    },
  ];

  const sendGroup = () => {
    console.log(students.map((stud) => ({ ...stud, date: currentData })));
  };

  return (
    <Container>
      <Stack direction="column" alignItems="center" gap="10px">
        <FormControl sx={{ m: 1, minWidth: 80, maxWidth: 340 }}>
          <InputLabel id="demo-simple-select-autowidth-label">
            Выберите свою группу
          </InputLabel>
          <Select
            value={group}
            onChange={handleChange}
            label="Выберите свою группу"
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
          >
            {groups.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DataGrid
          density="compact"
          disableColumnMenu
          disableColumnFilter
          disableColumnSorting
          disableDensitySelector
          hideFooterSelectedRowCount
          sx={{
            "& .MuiDataGrid-cell": { overflowX: "auto", textOverflow: "unset" },
          }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
        <Button onClick={sendGroup} variant="contained">
          Сохранить
        </Button>
        {
          email === "admin@admin" &&  <Link href="groups/create">
            Создать группу
          </Link>
        }
      </Stack>
    </Container>
  );
}

export default Groups;

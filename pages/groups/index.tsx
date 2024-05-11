import { useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Checkbox, Container, FormControl, Stack } from "@mui/material";
import { groups } from "./constants";
import { useAppSelector } from "@/store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

function CustomCheckbox({
  field,
  student,
}: {
  field: string;
  student: string;
}) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isChecked) {
      console.log(field, student);
    }
  }, [isChecked, field, student]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return <Checkbox checked={isChecked} onChange={handleChange} />;
}

function Groups() {
  const { email } = useAppSelector((state) => state.user.user);

  const [group, setGroup] = useState(groups[0].value);

  const handleChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value);
  };

  if (email !== "admin@admin") {
    return <div>нет доступа</div>;
  }

  const columns: GridColDef[] = [
    { field: "student", headerName: "Ученик", width: 130 },
    {
      field: "single",
      headerName: "Разовое",
      width: 120,
      renderCell: ({ row, colDef }) => (
        <CustomCheckbox field={colDef.field} student={row.student} />
      ),
    },
    {
      field: "subscription",
      headerName: "Абонимент",
      width: 120,
      renderCell: ({ row, colDef }) => (
        <CustomCheckbox field={colDef.field} student={row.student} />
      ),
    },
  ];

  const rows = [
    { id: 1, student: "Snow" },
    { id: 2, student: "Lannister" },
    { id: 3, student: "Lannister" },
  ];

  return (
    <Container>
      <Stack direction="column" alignItems="center">
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
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Stack>
    </Container>
  );
}

export default Groups;

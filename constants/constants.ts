export const arrayStudents = ["Камегунова Алиса	21.07	2016	ДГ"];

const handleTest = () => {
  const newArr = arrayStudents.map((e) => {
    const parts = e.split("\t");
    const nameStud = parts[0];
    const date = parts[1] + "." + parts[2];
    const group = parts[3];
    return { name: nameStud, date: date, place: group };
  });
};

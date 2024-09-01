import AuthService from "@/clientServices/AuthService";
import { useEffect, useState } from "react";

export const useGetStudents = () => {
  const [students, setStudents] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await AuthService.getStudents();
        setStudents(students.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return students;
};

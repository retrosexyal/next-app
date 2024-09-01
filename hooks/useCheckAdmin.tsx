import AuthService from "@/clientServices/AuthService";
import { ADMIN_EMAIL } from "@/constants/constants";
import { useAppSelector } from "@/store";
import { useLayoutEffect, useState } from "react";

export const useCheckAdmin = () => {
  const { email } = useAppSelector((state) => state.user.user);
  const [isAdmin, setIsAdmin] = useState(false);

  useLayoutEffect(() => {
    if (email === ADMIN_EMAIL) {
      setIsAdmin(true);
    }

    if (!email) {
      AuthService.refresh()
        .then(({ data }) => {
          const userEmail = data.user.email;
          setIsAdmin(userEmail === ADMIN_EMAIL);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return isAdmin;
};

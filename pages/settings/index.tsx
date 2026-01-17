import Students from "@/components/students";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./settings.module.scss";
import { useAppDispatch, useAppSelector } from "@/store";
import { Contract } from "@/components/contract";
import AuthService from "@/clientServices/AuthService";
import { setUser } from "@/store/slices/userSlice";
import ContractService from "@/clientServices/ContractService";
import MessageService from "@/clientServices/MessageService";
import { IContract } from "@/interface/iContact";
import { Loader } from "@/components/loader";
import { ContractInfo } from "@/components/contract-info";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";
import Button from "@/components/button";

const EMPTY_DATA = {
  _id: "",
  address: "",
  birthday: "",
  childrenName: "",
  diseases: "нет",
  isDone: false,
  isSend: false,
  KB: "",
  parentName: "",
  pasportDate: "",
  pasportPlace: "",
  phone: "",
  place: "",
  sex: "",
  user: "",
};

const Settings = () => {
  const { isActivated, email, id } = useAppSelector((state) => state.user.user);
  const [data, setData] = useState<IContract[]>([EMPTY_DATA]);
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    AuthService.refresh()
      .then(({ data }) => {
        const userData = data.user;
        dispatch(setUser(userData));
      })
      .then(() => {
        if (id) {
          ContractService.getContract(id, true)
            .then(({ data }) => {
              const isEmptyData = Array.isArray(data) && data.length === 0;
              setData(isEmptyData ? [EMPTY_DATA] : data);
            })
            .catch((err) => {
              console.log(err);
            });
          MessageService.getMessage()
            .then((data) => setMessage(data.data.message))
            .catch((e) => console.error(e));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, id]);

  const isNotAdmin = email !== "admin@admin";

  const handleAddChildren = () => {
    setData((prev) => [...prev, EMPTY_DATA]);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={`wrapper ${styles.wrapper}`}>
        {email === "admin@admin" && (
          <>
            <Link className={styles.link} href="/groups">
              Мои группы
            </Link>
            <Link className={styles.link} href="/admin">
              Согласование договоров
            </Link>
            <Students />
          </>
        )}
        <div className={styles.flex_col}>
          {isNotAdmin &&
            data?.map((contract, ind) => {
              const { isDone, _id, isSend, childrenName } = contract;
              const isLastItem = ind === data.length - 1;

              if (isDone) {
                return (
                  <>
                    <ContractInfo data={contract} key={`${_id}_${ind}`} />
                    {isLastItem && (
                      <Button
                        onClick={handleAddChildren}
                        text="добавить ребёнка"
                      />
                    )}
                  </>
                );
              }

              if (isSend) {
                return (
                  <>
                    <div
                      className={styles.content_wrapper}
                      key={`${_id}_${ind}`}
                    >
                      <h2 style={{ textAlign: "center" }}>
                        Ваш договор на занятия с ребёнком {childrenName}{" "}
                        находится на согласовании у руководителя студии
                      </h2>
                      <h3 style={{ textAlign: "center" }}>
                        После подписания он будет направлен Вам в почту
                      </h3>
                    </div>
                    {isLastItem && data.length < 3 && (
                      <Button
                        onClick={handleAddChildren}
                        text="добавить ребёнка"
                      />
                    )}
                  </>
                );
              }

              if (isActivated) {
                return (
                  <>
                    <p style={{ textAlign: "center", maxWidth: "80%" }}>
                      Заполните информация для заключения договора
                    </p>
                    <Contract
                      key={`${_id}_${ind}`}
                      info={contract}
                      setInfo={setData}
                    />
                  </>
                );
              }

              return null;
            })}
        </div>
        {message && (
          <div>
            <h2 style={{ textAlign: "center" }}>
              Сообщение от руководителя студии ЛиМи:
            </h2>
            <h3 style={{ textAlign: "center" }}>{message}</h3>
          </div>
        )}
        {isLoading && <Loader />}
      </div>
    </ThemeProvider>
  );
};

export default Settings;

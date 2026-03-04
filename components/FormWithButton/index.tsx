import { useState } from "react";
import Popup from "../popup";
import { FormSend } from "../form-send";
import { Button } from "@mui/material";
import styles from "./form-with-button.module.scss";

export function FormWithButton({ isForOldForm = false }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <Button
        className={styles.secondary}
        onClick={() => {
          setIsFormOpen(true);
        }}
      >
        Записаться
      </Button>
      {isFormOpen && (
        <Popup onClick={() => setIsFormOpen(false)}>
          <FormSend isForOldForm={isForOldForm} />
        </Popup>
      )}
    </>
  );
}

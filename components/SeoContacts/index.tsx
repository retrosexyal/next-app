import { Button } from "@mui/material";
import styles from "./SeoContact.module.scss";
import { useState } from "react";
import Popup from "../popup";
import { FormSend } from "../form-send";

type Props = {
  direction: string;
  age: string;
};

export const SeoContact = ({ direction, age }: Props) => {
  const [showPhone, setShowPhone] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCallClick = () => {
    const isMobile = /mobile|iphone|android/i.test(
      navigator.userAgent.toLowerCase(),
    );

    if (isMobile) {
      window.location.href = "tel:+375291999231";
    } else {
      setShowPhone(true);
    }
  };

  return (
    <section
      className={styles.section}
      aria-labelledby="contact-title"
      itemScope
      itemType="https://schema.org/SportsActivityLocation"
    >
      <div className="wrapper">
        <h2 id="contact-title" className={styles.title}>
          Записаться на {direction} для детей в Могилёве
        </h2>

        <p className={styles.text}>
          Школа-студия <strong>ЛиМи</strong> приглашает детей {age} на занятия
          по направлению «{direction}». Мы поможем подобрать удобное расписание,
          расскажем о формате занятий и ответим на все вопросы.
        </p>

        <div className={styles.actions}>
          <a
            href="tel:+375291999231"
            className={styles.phone}
            itemProp="telephone"
          >
            +375 (29) 199-92-31
          </a>

          <Button
            variant="contained"
            className={styles.button}
            onClick={handleCallClick}
          >
            {showPhone ? "+375 (29) 199-92-31" : "Позвонить и записаться"}
          </Button>

          <button
            className={styles.secondary}
            onClick={() => setIsFormOpen(true)}
          >
            Оставить заявку
          </button>
        </div>
        {isFormOpen && (
          <Popup onClick={() => setIsFormOpen(false)}>
            <FormSend />
          </Popup>
        )}

        {/* schema.org */}
        <meta itemProp="name" content="Школа-студия ЛиМи" />
        <meta itemProp="addressLocality" content="Могилёв" />
        <meta itemProp="addressCountry" content="BY" />
        <meta itemProp="url" content="https://limistudio.by" />
      </div>
    </section>
  );
};

import Link from "next/link";
import Image from "next/image";
import { Button } from "@mui/material";
import styles from "./stretching-preview.module.scss";
import { Link as ScrollLink } from "react-scroll";
import { FormWithButton } from "../FormWithButton";

export const StretchingPreview = () => {
  return (
    <section className={styles.section} id="stretching">
      <div className="wrapper">
        <h2 className={styles.title}>
          Стретчинг для женщин в Могилёве и онлайн
        </h2>
        <p className={styles.subtitle}>
          Мягкое похудение, гибкость и поддержание формы — без жёстких нагрузок.
          Подходит с нуля.
        </p>

        <div className={styles.card}>
          <div className={styles.media}>
            <Image
              src="/imgs/stretching/card.webp"
              alt="Стретчинг для женщин"
              fill
              className={styles.img}
              sizes="(max-width: 900px) 100vw, 520px"
            />
            <div className={styles.badge}>18+</div>
          </div>

          <div className={styles.content}>
            <div className={styles.points}>
              <div className={styles.point}>
                <span className={styles.label}>Расписание</span>
                <span className={styles.value}>
                  Понедельник и четверг · 20:00–21:00
                </span>
              </div>

              <div className={styles.point}>
                <span className={styles.label}>В студии</span>
                <span className={styles.value}>12 BYN · разовое</span>
              </div>

              <div className={styles.point}>
                <span className={styles.label}>Онлайн</span>
                <span className={styles.value}>
                  5 BYN · закрытая трансляция (если не можете прийти)
                </span>
              </div>

              <div className={styles.point}>
                <span className={styles.label}>Абонемент</span>
                <span className={styles.value}>возможен, выгоднее разовых</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/stretching" className={styles.link}>
                <Button className={styles.cta}>Подробнее</Button>
              </Link>
              <FormWithButton isForOldForm />

              {/*  <Link href="/#contact" className={styles.link}>
                <Button className={styles.secondary}>Записаться</Button>
              </Link> */}
              {/* <ScrollLink
                activeClass="active"
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className={styles.link}
              >
                <Button className={styles.secondary}>Записаться</Button>
              </ScrollLink> */}
            </div>

            <p className={styles.note}>
              Онлайн — это реальное занятие в то же время, просто в формате
              закрытой трансляции.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

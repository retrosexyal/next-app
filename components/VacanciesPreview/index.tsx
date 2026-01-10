import Link from "next/link";
import styles from "./vacancies-preview.module.scss";

export const VacanciesPreview = () => {
  return (
    <section className={styles.preview}>
      <div className="wrapper">
        <header className={styles.header}>
          <h2 className={styles.title}>Вакансии в школе-студии ЛиМи</h2>
          <p className={styles.description}>
            Школа-студия танца «ЛиМи» в Могилёве приглашает в команду педагогов по
            хореографии и гимнастике. Мы предлагаем работу в творческой
            атмосфере, участие в концертах и профессиональное развитие.
          </p>
        </header>

        <div className={styles.previewCards}>
          <Link href="/vacancies" className={styles.card}>
            Педагог-хореограф
          </Link>

          <Link href="/vacancies" className={styles.card}>
            Педагог по гимнастике
          </Link>
        </div>

        <Link href="/vacancies" className={styles.all}>
          Смотреть все вакансии
        </Link>
      </div>
    </section>
  );
};

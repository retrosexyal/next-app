import styles from "./StretchingPrice.module.scss";

export const StretchingPrice = () => {
  return (
    <section className={styles.section} aria-labelledby="price-title">
      <div className="wrapper">
        <h2 id="price-title" className={styles.title}>
          Стоимость и формат занятий
        </h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Занятия в студии</h3>
            <ul>
              <li>
                <strong>12 BYN</strong> — разовое занятие
              </li>
              <li>
                <strong>Абонемент — 84 BYN</strong>
              </li>
              <li>8 занятий (2 раза в неделю)</li>
              <li>Выгоднее разовых занятий</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Онлайн-занятия</h3>
            <ul>
              <li>
                <strong>5 BYN</strong> — одно занятие
              </li>
              <li>Закрытая онлайн-трансляция</li>
              <li>Проходит в то же время, что и занятия в студии</li>
              <li>Подходит, если не можете прийти лично</li>
            </ul>
          </div>
        </div>

        <p className={styles.note}>
          Онлайн-занятия проходят на нашем YouTube-канале по{" "}
          <strong>уникальной приватной ссылке</strong>, доступ к которой вы
          получаете после оплаты перед началом занятия.
        </p>
      </div>
    </section>
  );
};

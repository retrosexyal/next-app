import styles from "./StretchingProcess.module.scss";

export const StretchingProcess = () => {
  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className={styles.videoWrapper}>
        <iframe
          src="https://www.youtube.com/embed/0zMr7DZFpuM"
          title="Концерт школы-студии ЛиМи в Могилёве"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="wrapper">
        <h2 id="process-title" className={styles.title}>
          Как проходят занятия по стретчингу
        </h2>

        <div className={styles.text}>
          <p>
            Занятия проходят в спокойной и комфортной атмосфере. Мы работаем под
            приятную музыку, постепенно разогреваем тело и мягко растягиваем
            основные группы мышц.
          </p>

          <p>
            Все упражнения выполняются без резких движений и перегрузок. Тренер
            показывает технику и помогает адаптировать упражнения под уровень
            подготовки каждой участницы.
          </p>

          <p>
            Занятие помогает снять напряжение после рабочего дня, улучшить
            гибкость, осанку и общее самочувствие. После тренировки появляется
            лёгкость в теле и ощущение расслабления.
          </p>
        </div>
      </div>
    </section>
  );
};

import styles from "./YoutubeSection.module.scss";

export const YoutubeSection = () => {
  return (
    <section className={styles.section} aria-labelledby="youtube-title">
      <div className="wrapper">
        <h2 id="youtube-title" className={styles.title}>
          Выступления и концерты школы-студии ЛиМи
        </h2>

        <p className={styles.text}>
          Посмотрите, как проходят концерты и выступления учеников школы-студии
          <strong> ЛиМи </strong> в Могилёве. Живые эмоции, сцена, уверенность и
          результат регулярных занятий хореографией и гимнастикой.
        </p>

        <div className={styles.videoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/aYNTfPqRcZ4"
            title="Концерт школы-студии ЛиМи в Могилёве"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

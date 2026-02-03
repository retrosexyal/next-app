import styles from "./about.module.scss";
import { AboutCard } from "@/components/about-card";
import { content } from "@/components/about-card/constants";

export const About = () => {
  return (
    <div className={`${styles.container}`}>
      <div className="wrapper">
        <h2 className={styles.title}>Наши занятия помогут</h2>
        <div className={styles.content}>
          {content.map((cont) => {
            return (
              <AboutCard
                src={cont.img}
                title={cont.title}
                subtitle={cont.subtitle}
                key={cont.img}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

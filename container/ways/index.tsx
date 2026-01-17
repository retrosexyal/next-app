import { content } from "./constants";
import { Title } from "@/components/UI/title";
import styles from "./ways.module.scss";
import Link from "next/link";

export const Ways = () => {
  return (
    <section className={styles.wrapper} id="ways">
      <div className="wrapper">
        <Title text="В нашей школе-студии мы обучаем" />

        <div className={styles.grid}>
          {content.map(({ href, img, subtitle, title, wayTitle }) => (
            <Link href={href} className={styles.card} key={img}>
              <div className={styles.imageWrapper}>
                <img src={img} alt={title} />

                <div className={styles.overlay}>
                  <p>{wayTitle}</p>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3>{title}</h3>
                <span className={styles.age}>{subtitle}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

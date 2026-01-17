import Image from "next/image";
import styles from "./WayPage.module.scss";

type Props = {
  title: string;
  subtitle: string;
  seoText: string[];
  benefits: string[];
  audience: string;
  photos: string[];
};

export const WayPage = ({
  title,
  subtitle,
  seoText,
  benefits,
  audience,
  photos,
}: Props) => {
  return (
    <section className={styles.page}>
      <div className="wrapper">
        {/* HERO */}
        <header className={styles.hero}>
          <h1>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        {/* TEXT */}
        <div className={styles.content}>
          {seoText.map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          <h2 className={styles.sectionTitle}>Преимущества занятий</h2>

          <div className={styles.benefits}>
            {benefits.map((item) => (
              <div className={styles.benefitCard} key={item}>
                <span className={styles.icon}>✦</span>
                <p>{item}</p>
              </div>
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Кому подойдут занятия</h2>
          <p className={styles.audience}>{audience}</p>
        </div>

        {/* GALLERY */}
        <div className={styles.gallery}>
          {photos.map((src, index) => (
            <div className={styles.photo} key={src}>
              <Image
                src={src}
                alt={`${title} в школе-студии ЛиМи`}
                width={500}
                height={650}
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

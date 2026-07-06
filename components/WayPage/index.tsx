import Image from "next/image";
import styles from "./WayPage.module.scss";

type Props = {
  title: string;
  subtitle: string;
  seoText: string[];
  benefits: string[];
  audience: string;
  photos: string[];
  quickFacts?: {
    title: string;
    text: string;
  }[];
  program?: {
    title: string;
    text: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
};

export const WayPage = ({
  title,
  subtitle,
  seoText,
  benefits,
  audience,
  photos,
  quickFacts,
  program,
  faq,
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

          {!!quickFacts?.length && (
            <div className={styles.quickFacts} aria-label="Краткая информация">
              {quickFacts.map((item) => (
                <div className={styles.fact} key={item.title}>
                  <span>{item.title}</span>
                  <strong>{item.text}</strong>
                </div>
              ))}
            </div>
          )}

          <h2 className={styles.sectionTitle}>Преимущества занятий</h2>

          <div className={styles.benefits}>
            {benefits.map((item) => (
              <div className={styles.benefitCard} key={item}>
                <span className={styles.icon}>✦</span>
                <p>{item}</p>
              </div>
            ))}
          </div>

          {!!program?.length && (
            <>
              <h2 className={styles.sectionTitle}>Как проходят занятия</h2>
              <div className={styles.program}>
                {program.map((item) => (
                  <article className={styles.programItem} key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </>
          )}

          <h2 className={styles.sectionTitle}>Кому подойдут занятия</h2>
          <p className={styles.audience}>{audience}</p>

          {!!faq?.length && (
            <>
              <h2 className={styles.sectionTitle}>Частые вопросы</h2>
              <div className={styles.faq}>
                {faq.map((item) => (
                  <details className={styles.faqItem} key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </>
          )}
        </div>

        {/* GALLERY */}
        {!!photos.length && (
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
        )}
      </div>
    </section>
  );
};

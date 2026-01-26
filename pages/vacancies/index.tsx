import styles from "./vacancies.module.scss";
import Head from "next/head";

export default function VacanciesPage() {
  return (
    <>
      <Head>
        <title>Вакансии | Школа-студия танца ЛиМи | Могилёв</title>

        <meta
          name="description"
          content="Вакансии в школе-студии ЛиМи в Могилёве. Ищем педагогов по хореографии и гимнастике для работы с детьми."
        />

        <meta
          name="keywords"
          content="вакансии хореограф Могилев, педагог гимнастика вакансии, работа в школе танца, школа-студия ЛиМи вакансии"
        />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Вакансии | Школа-студия ЛиМи" />
        <meta
          property="og:description"
          content="Присоединяйтесь к команде школы-студии танца ЛиМи. Работа с детьми, концерты, развитие."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://limistudio.by/vacancies" />
        <link rel="canonical" href="https://limistudio.by/vacancies" />
      </Head>

      <script
        id="job-posting"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: "Педагог-хореограф/Педагог по гимнастики",
            description:
              "Проведение занятий по хореографии/гимнастики для детей от 3 до 14 лет.",
            datePosted: "2026-01-20",
            validThrough: "2026-12-31",
            employmentType: ["PART_TIME", "FULL_TIME"],
            hiringOrganization: {
              "@type": "Organization",
              name: "Школа-студия танца ЛиМи",
              sameAs: "https://limistudio.by",
              logo: "https://limistudio.by/og/logo_colored.webp",
            },
            jobLocation: [
              {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "ул. Орловского, 24а",
                  addressLocality: "Могилёв",
                  addressRegion: "Могилёвская область",
                  postalCode: "212000",
                  addressCountry: "BY",
                },
              },
              {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "ул. Златоустовского, 1",
                  addressLocality: "Могилёв",
                  addressRegion: "Могилёвская область",
                  postalCode: "212000",
                  addressCountry: "BY",
                },
              },
              {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "ул. Крупской, 137",
                  addressLocality: "Могилёв",
                  addressRegion: "Могилёвская область",
                  postalCode: "212000",
                  addressCountry: "BY",
                },
              },
            ],
            baseSalary: {
              "@type": "MonetaryAmount",
              currency: "BYN",
              value: {
                "@type": "QuantitativeValue",
                minValue: 15,
                maxValue: 40,
                unitText: "HOUR",
              },
            },
          }),
        }}
      />

      <section className={styles.vacancies}>
        <div className={`${styles.wrapper} wrapper`}>
          <h1 className={styles.title}>Вакансии</h1>
          <p className={styles.subtitle}>
            Мы ищем педагогов, которые любят детей, ценят творчество и хотят
            развиваться в сильной и дружной команде
          </p>

          <div className={styles.cards}>
            <div className={styles.card}>
              <h3>Педагог-хореограф</h3>
              <span className={styles.type}>Частичная / полная занятость</span>

              <p className={styles.text}>
                Вы будете вести занятия по хореографии для детей от 3 до 14 лет
                в уже сформированных группах. Вам не потребуется самостоятельно
                искать учеников — мы полностью берём это на себя. Вы станете
                частью команды школы-студии «ЛиМи», будете участвовать в
                подготовке номеров, выступлениях и развитии учеников.
              </p>

              <ul>
                <li>Профильное образование или уверенный практический опыт</li>
                <li>Любовь к детям и умение находить с ними контакт</li>
                <li>
                  Желание развиваться и участвовать в концертной жизни студии
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Педагог по гимнастике</h3>
              <span className={styles.type}>Частичная / полная занятость</span>

              <p className={styles.text}>
                Работа предполагает проведение занятий по гимнастике и растяжке
                с младшими группами, которые уже сформированы. Поиск учеников не
                требуется — вы работаете с готовыми группами в комфортных
                условиях и с поддержкой администрации студии.
              </p>

              <ul>
                <li>Опыт работы с детьми или спортивная подготовка</li>
                <li>Внимательное отношение к технике и безопасности</li>
                <li>Доброжелательность и ответственность</li>
              </ul>
            </div>
          </div>
          <div className={styles.offer}>
            <h2>Что мы предлагаем</h2>
            <ul>
              <li>
                Работу с уже сформированными группами — без поиска учеников
              </li>
              <li>
                Гибкое количество часов в неделю — нагрузка согласовывается
              </li>
              <li>
                Высокий уровень оплаты труда, который зависит от количества
                часов и нагрузки
              </li>
              <li>Поддержку администрации и комфортные условия работы</li>
              <li>Участие в концертах, мероприятиях и жизни студии</li>
            </ul>
          </div>

          <div className={styles.cta}>
            <h2>Хотите работать у нас?</h2>
            <h2>Хотите стать частью команды «ЛиМи»?</h2>
            <p className={styles.ctaText}>
              Напишите или позвоните нам — мы будем рады познакомиться и
              ответить на все вопросы
            </p>
            <a href="tel:+375291999231" className={styles.button}>
              Позвонить
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

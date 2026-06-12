import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import PlaceIcon from "@mui/icons-material/Place";
import Head from "next/head";
import Image from "next/image";
import styles from "./weddingDance.module.scss";

const pageUrl = "https://www.limistudio.by/svadebnyy-tanec";
const instagramUrl = "https://www.instagram.com/weddance_mog/";
const phoneHref = "tel:+375291999231";
const phoneText = "+375 29 199 92 31";

const galleryImages = [
  {
    src: "/imgs/wedding-dance/hero.webp",
    alt: "Первый свадебный танец на открытой площадке в Могилёве",
  },
  {
    src: "/imgs/wedding-dance/first-dance.webp",
    alt: "Эффектная поддержка в свадебном танце",
  },
  {
    src: "/imgs/wedding-dance/lift.webp",
    alt: "Романтический свадебный танец с поддержкой",
  },
  {
    src: "/imgs/wedding-dance/evening-vertical.webp",
    alt: "Свадебный танец молодых вечером с гостями",
  },
  {
    src: "/imgs/wedding-dance/ceremony.webp",
    alt: "Пара исполняет свадебный танец на площадке",
  },
  {
    src: "/imgs/wedding-dance/smoke.webp",
    alt: "Первый танец молодых с дымом и светом",
  },
  {
    src: "/imgs/wedding-dance/road.webp",
    alt: "Фотосессия пары после постановки танца",
  },
  {
    src: "/imgs/wedding-dance/couple-team.webp",
    alt: "Свадебный танец на сцене",
  },
];

const benefits = [
  "Постановка под вашу песню, характер пары и формат свадьбы",
  "Комфортно для тех, кто никогда не танцевал",
  "Репетиции в зале и прогон на площадке перед торжеством",
  "Поддержки, выход, финал и красивые переходы без лишней сложности",
];

const services = [
  {
    title: "Первый танец молодых",
    text: "Романтичная, нежная или эффектная постановка, которую реально выучить без танцевального опыта.",
  },
  {
    title: "Танец-сюрприз",
    text: "Номер для жениха, невесты, друзей или подружек невесты с понятной структурой и ярким финалом.",
  },
  {
    title: "Прогон на площадке",
    text: "Адаптация танца под платье, свет, дым, размеры зала и расположение гостей.",
  },
];

const steps = [
  "Обсуждаем песню, стиль свадьбы, платье и ваши пожелания.",
  "Собираем хореографию с учетом уровня пары и сроков подготовки.",
  "Отрабатываем движения, поддержки, уверенность и эмоции.",
  "Делаем финальный прогон, чтобы в день свадьбы все было спокойно.",
];

const faqs = [
  {
    question: "За сколько до свадьбы лучше начинать репетиции?",
    answer:
      "Оптимально за 1-2 месяца. Если времени меньше, можно поставить лаконичный танец и сосредоточиться на самых выразительных моментах.",
  },
  {
    question: "Можно ли заниматься, если мы совсем не танцуем?",
    answer:
      "Да. Постановка строится так, чтобы движения выглядели красиво, но оставались комфортными именно для вашей пары.",
  },
  {
    question: "Можно ли поставить танец под нашу песню?",
    answer:
      "Да. Можно прийти со своей песней или выбрать музыку вместе, если вы пока сомневаетесь между несколькими вариантами.",
  },
  {
    question: "Где проходят занятия?",
    answer:
      "Репетиции проходят в Могилёве. Также можно отдельно согласовать прогон на вашей свадебной площадке.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Weddance Mog | Постановка свадебного танца",
    description:
      "Индивидуальная постановка свадебного танца в Могилёве для пар без танцевального опыта.",
    image: "https://www.limistudio.by/imgs/wedding-dance/hero.webp",
    url: pageUrl,
    telephone: "+375291999231",
    sameAs: [instagramUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Могилёв",
      addressCountry: "BY",
    },
    areaServed: "Могилёв",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Постановка свадебного танца",
    name: "Постановка первого свадебного танца в Могилёве",
    provider: {
      "@type": "Person",
      name: "Елизавета",
    },
    areaServed: {
      "@type": "City",
      name: "Могилёв",
    },
    url: pageUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

export default function WeddingDancePage() {
  return (
    <>
      <Head>
        <title>Постановка свадебного танца в Могилёве | Weddance Mog</title>
        <meta
          name="description"
          content="Постановка свадебного танца в Могилёве для пар без танцевального опыта. Первый танец молодых, репетиции в зале, прогон на площадке. Хореограф Елизавета."
          key="description"
        />
        <meta
          name="keywords"
          content="постановка свадебного танца Могилёв, свадебный танец Могилёв, первый танец молодых, хореограф на свадьбу Могилёв, Weddance Mog"
          key="keywords"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" key="og:type" />
        <meta
          property="og:site_name"
          content="Weddance Mog"
          key="og:site_name"
        />
        <meta
          property="og:title"
          content="Постановка свадебного танца в Могилёве"
          key="og:title"
        />
        <meta
          property="og:description"
          content="Индивидуальный первый танец молодых: красиво, спокойно и под ваш уровень."
          key="og:description"
        />
        <meta property="og:url" content={pageUrl} key="og:url" />
        <meta
          property="og:image"
          content="https://www.limistudio.by/imgs/wedding-dance/hero.webp"
          key="og:image"
        />
        <meta property="og:locale" content="ru_RU" />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter:card"
        />
        <meta
          name="twitter:title"
          content="Постановка свадебного танца в Могилёве"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="Хореограф Елизавета. Первый танец молодых даже для тех, кто никогда не танцевал."
          key="twitter:description"
        />
        <meta
          name="twitter:image"
          content="https://www.limistudio.by/imgs/wedding-dance/hero.webp"
          key="twitter:image"
        />
        <link rel="canonical" href={pageUrl} key="canonical" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className={styles.page}>
        <header className={styles.topbar}>
          <a className={styles.brand} href="#top" aria-label="Weddance Mog">
            <span>Weddance Mog</span>
            <small>свадебный танец</small>
          </a>
          <nav className={styles.nav} aria-label="Навигация по странице">
            <a href="#process">Процесс</a>
            <a href="#gallery">Пары</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a className={styles.topPhone} href={phoneHref}>
            <PhoneInTalkIcon aria-hidden="true" />
            <span>{phoneText}</span>
          </a>
        </header>

        <section className={styles.hero} id="top">
          <div className={styles.heroMosaic} aria-hidden="true">
            {galleryImages.slice(0, 6).map((image, index) => (
              <div className={styles.mosaicItem} key={image.src}>
                <Image
                  src={image.src}
                  alt=""
                  fill
                  priority={index < 2}
                  sizes="(max-width: 700px) 50vw, 24vw"
                />
              </div>
            ))}
          </div>
          <div className={styles.heroOverlay} />

          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Хореограф Елизавета · Могилёв</p>
            <h1>Постановка свадебного танца в Могилёве</h1>
            <p className={styles.lead}>
              Первый танец молодых, который выглядит естественно, красиво и
              уверенно даже без танцевального опыта. Под вашу музыку, платье,
              площадку и настроение свадьбы.
            </p>
            <div className={styles.actions}>
              <a
                className={styles.primaryButton}
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon aria-hidden="true" />
                <span>Записаться в Instagram</span>
              </a>
              <a className={styles.secondaryButton} href={phoneHref}>
                <PhoneInTalkIcon aria-hidden="true" />
                <span>Позвонить</span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.intro} aria-label="Преимущества">
          <div className={styles.introText}>
            <span className={styles.sectionLabel}>Weddance Mog</span>
            <h2>Танец, в котором вы узнаете себя</h2>
            <p>
              Свадебный танец не должен быть сложным номером ради сложности.
              Хорошая постановка помогает паре чувствовать музыку, держаться
              уверенно перед гостями и прожить момент без напряжения.
            </p>
          </div>
          <ul className={styles.benefits}>
            {benefits.map((benefit) => (
              <li key={benefit}>
                <CheckCircleOutlineIcon aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.services} aria-labelledby="services-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>Форматы</span>
            <h2 id="services-title">Что можно поставить</h2>
          </div>
          <div className={styles.serviceGrid}>
            {services.map((service, index) => (
              <article className={styles.serviceCard} key={service.title}>
                {index === 0 && <FavoriteBorderIcon aria-hidden="true" />}
                {index === 1 && <MusicNoteIcon aria-hidden="true" />}
                {index === 2 && <PlaceIcon aria-hidden="true" />}
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.process}
          id="process"
          aria-labelledby="process-title"
        >
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>Подготовка</span>
            <h2 id="process-title">Как проходит постановка</h2>
            <p>
              Репетиции идут по понятному плану: от идеи и музыки до спокойного
              финального прогона перед свадьбой.
            </p>
          </div>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className={styles.gallerySection}
          id="gallery"
          aria-labelledby="gallery-title"
        >
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>Портфолио</span>
            <h2 id="gallery-title">Пары и свадебные моменты</h2>
          </div>
          <div className={styles.gallery}>
            {galleryImages.map((image, index) => (
              <figure className={styles.galleryItem} key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={242}
                  height={297}
                  sizes="(max-width: 700px) 50vw, 25vw"
                />
                {/*  {index === 0 && (
                  <figcaption>Постановка под площадку и образ пары</figcaption>
                )} */}
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.cta} aria-label="Запись на постановку">
          <div>
            <span className={styles.sectionLabel}>Запись</span>
            <h2>Начните с песни и даты свадьбы</h2>
            <p>
              Напишите в Instagram или позвоните: обсудим сроки, музыку,
              количество репетиций и удобный формат подготовки.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <a
              className={styles.primaryButton}
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon aria-hidden="true" />
              <span>@weddance_mog</span>
              <ArrowForwardIcon aria-hidden="true" />
            </a>
            <a className={styles.secondaryButton} href={phoneHref}>
              <CalendarMonthIcon aria-hidden="true" />
              <span>{phoneText}</span>
            </a>
          </div>
        </section>

        <section className={styles.faq} id="faq" aria-labelledby="faq-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>FAQ</span>
            <h2 id="faq-title">Частые вопросы</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

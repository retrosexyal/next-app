import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import style from "./documents.module.scss";

const documents = [
  {
    id: "registration",
    label: "Регистрация организации",
    title: "Свидетельство о государственной регистрации",
    description: "17 декабря 2025 года в Единый государственный регистр юридических лиц и индивидуальных предпринимателей внесена запись о государственной регистрации ООО «Про свет ЛиМи».",
    issuer: "Администрация Ленинского района г. Могилева",
    src: "/imgs/1.png",
    width: 576,
    height: 789,
    alt: "Свидетельство о государственной регистрации ООО «Про свет ЛиМи», регистрационный номер 791421071",
    details: [{ label: "Регистрационный номер", value: "791421071" }, { label: "Дата регистрации", value: "17 декабря 2025", date: "2025-12-17" }],
  },
  {
    id: "accreditation",
    label: "Аккредитация деятельности",
    title: "Сертификат государственной аккредитации",
    description: "ООО «Про свет ЛиМи» имеет государственную аккредитацию на право осуществления деятельности по развитию физической культуры и спорта. В сертификате указаны, в частности, занятия гимнастикой, стретчингом и фитнесом.",
    issuer: "Могилевский городской исполнительный комитет. Решение от 23 февраля 2026 года № 6-4.",
    src: "/sertificat.webp",
    width: 2967,
    height: 4167,
    alt: "Сертификат государственной аккредитации ООО «Про свет ЛиМи» № 791142071, действует до 22 февраля 2031 года",
    details: [{ label: "Номер сертификата", value: "791142071" }, { label: "Действует до", value: "22 февраля 2031", date: "2031-02-22" }],
  },
];

export default function Documents() {
  return (
    <>
      <Head>
        <title>Документы: регистрация и аккредитация | ЛиМи, Могилёв</title>
        <meta name="description" content="Официальные документы школы-студии ЛиМи в Могилёве: свидетельство о регистрации ООО «Про свет ЛиМи» и сертификат государственной аккредитации. Реквизиты и сканы документов." key="description" />
        <meta property="og:title" content="Официальные документы школы-студии ЛиМи" key="og:title" />
        <meta property="og:description" content="Государственная регистрация и аккредитация ООО «Про свет ЛиМи». Реквизиты и оригиналы документов." key="og:description" />
        <meta property="og:url" content="https://www.limistudio.by/documents" key="og:url" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Официальные документы школы-студии ЛиМи",
          url: "https://www.limistudio.by/documents",
          about: { "@type": "Organization", name: "Школа-студия ЛиМи", legalName: "ООО «Про свет ЛиМи»", url: "https://www.limistudio.by" },
          hasPart: documents.map((document) => ({ "@type": "DigitalDocument", name: document.title, url: `https://www.limistudio.by${document.src}`, description: document.description })),
        }) }} />
      </Head>
      <div className={style.page}>
        <div className={style.content}>
          <nav aria-label="Хлебные крошки" className={style.breadcrumbs}>
            <Link href="/">Главная</Link><span aria-hidden="true">/</span><span aria-current="page">Документы</span>
          </nav>
          <header className={style.intro}>
            <span className={style.eyebrow}>Школа-студия ЛиМи · Могилёв</span>
            <h1>Официальные документы</h1>
            <p>Государственная регистрация и аккредитация ООО «Про свет ЛиМи». Здесь можно ознакомиться с реквизитами и открыть сканы документов.</p>
          </header>
          <div className={style.cards}>
            {documents.map((document) => (
              <article key={document.id} className={style.card} aria-labelledby={`${document.id}-title`}>
                <a className={style.preview} href={document.src} target="_blank" rel="noopener noreferrer" aria-label={`Открыть: ${document.title} (в новой вкладке)`}>
                  <Image src={document.src} alt={document.alt} width={document.width} height={document.height} sizes="(max-width: 600px) 160px, 190px" />
                  <span>Посмотреть скан <span aria-hidden="true">↗</span></span>
                </a>
                <div className={style.details}>
                  <span className={style.eyebrow}>{document.label}</span>
                  <h2 id={`${document.id}-title`}>{document.title}</h2>
                  <p className={style.description}>{document.description}</p>
                  <dl className={style.facts}>
                    {document.details.map((detail) => (
                      <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.date ? <time dateTime={detail.date}>{detail.value}</time> : detail.value}</dd></div>
                    ))}
                  </dl>
                  <p className={style.issuer}><span>Кем выдан</span>{document.issuer}</p>
                  <a className={style.open} href={document.src} target="_blank" rel="noopener noreferrer">Открыть документ <span aria-hidden="true">↗</span><span className={style.srOnly}> (в новой вкладке)</span></a>
                </div>
              </article>
            ))}
          </div>
          <p className={style.note}>Сканы открываются в новой вкладке — их можно увеличить для чтения всех реквизитов.</p>
        </div>
      </div>
    </>
  );
}

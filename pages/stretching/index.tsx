import { SeoContact } from "@/components/SeoContacts";
import { StretchingPrice } from "@/components/StretchingPrice";
import { StretchingProcess } from "@/components/StretchingProcess";
import { WayPage } from "@/components/WayPage";
import Head from "next/head";

export default function StretchingPage() {
  return (
    <>
      <Head>
        <title>
          Стретчинг для женщин в Могилёве — похудение и форма | ЛиМи
        </title>

        <meta
          name="description"
          content="Стретчинг для женщин в Могилёве и онлайн. Мягкое похудение, гибкость и поддержание формы. Занятия 2 раза в неделю, подходит с нуля."
        />

        <meta
          name="keywords"
          content="стретчинг Могилёв, стретчинг для женщин, растяжка для женщин, похудение без спорта, онлайн стретчинг"
        />

        <meta property="og:title" content="Стретчинг для женщин | ЛиМи" />
        <meta
          property="og:description"
          content="Гибкость, лёгкость и красивая фигура без перегрузок"
        />
        <meta
          property="og:image"
          content="https://limistudio.by/og/stretching.webp"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Школа-студия ЛиМи" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "Стретчинг для женщин",
              description:
                "Стретчинг для женщин: мягкое похудение, гибкость и поддержание формы. Занятия в студии в Могилёве и онлайн в формате закрытой трансляции.",
              provider: {
                "@type": "SportsActivityLocation",
                name: "Школа-студия ЛиМи",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Могилёв",
                  addressCountry: "BY",
                },
                telephone: "+375291999231",
                url: "https://limistudio.by",
              },
              areaServed: [
                {
                  "@type": "AdministrativeArea",
                  name: "Беларусь",
                },
                {
                  "@type": "Place",
                  name: "Онлайн",
                },
              ],
              availableChannel: [
                {
                  "@type": "ServiceChannel",
                  serviceLocation: {
                    "@type": "Place",
                    name: "Онлайн-занятия",
                  },
                },
                {
                  "@type": "ServiceChannel",
                  serviceLocation: {
                    "@type": "Place",
                    name: "Могилёв",
                  },
                },
              ],
              offers: [
                {
                  "@type": "Offer",
                  name: "Разовое занятие в студии",
                  price: "12",
                  priceCurrency: "BYN",
                  availability: "https://schema.org/InStock",
                },
                {
                  "@type": "Offer",
                  name: "Абонемент на 8 занятий",
                  price: "84",
                  priceCurrency: "BYN",
                  availability: "https://schema.org/InStock",
                },
                {
                  "@type": "Offer",
                  name: "Онлайн-занятие (закрытая трансляция)",
                  price: "5",
                  priceCurrency: "BYN",
                  availability: "https://schema.org/InStock",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Подходит ли стретчинг для женщин без подготовки?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Да, занятия подходят для женщин любого уровня подготовки. Все упражнения выполняются мягко, без резких движений и адаптируются под возможности каждой участницы.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Когда проходят занятия по стретчингу?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Занятия проходят два раза в неделю — по понедельникам и четвергам с 20:00 до 21:00. Это удобное вечернее время после рабочего дня.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Сколько стоит занятие по стретчингу?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Разовое занятие в студии стоит 12 BYN. Также доступен абонемент на 8 занятий стоимостью 84 BYN, что выгоднее разовых посещений.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Есть ли онлайн-занятия по стретчингу?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Да, доступны онлайн-занятия в формате закрытой трансляции. Они проходят в то же время, что и занятия в студии, и подходят для женщин из любого города.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Где проходят онлайн-занятия?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Онлайн-занятия проходят на YouTube по приватной ссылке. Доступ предоставляется после записи на занятие.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Помогает ли стретчинг похудеть?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Да, регулярные занятия стретчингом способствуют мягкому снижению веса, улучшению тонуса мышц и поддержанию формы без жёстких тренировок.",
                  },
                },
              ],
            }),
          }}
        />
      </Head>

      <WayPage
        title="Стретчинг для женщин в Могилёве"
        subtitle="Похудение, гибкость и поддержание формы"
        seoText={[
          "Стретчинг в школе-студии ЛиМи — это комфортные занятия для женщин, которые помогают мягко похудеть, подтянуть тело и улучшить самочувствие без жёстких тренировок.",
          "Занятия проходят два раза в неделю — по понедельникам и четвергам с 20:00 до 21:00. Это удобное вечернее время для тех, кто хочет заботиться о себе после рабочего дня.",
          "Также доступны онлайн-занятия в формате закрытой трансляции. Онлайн-формат подходит для женщин из любого города — вы можете заниматься из дома в то же время, что и группа в студии.",
        ]}
        benefits={[
          "мягкое и безопасное похудение",
          "поддержание формы без перегрузок",
          "улучшение гибкости и осанки",
          "снятие напряжения после рабочего дня",
          "занятия подходят с нуля",
        ]}
        audience="Занятия предназначены для женщин любого уровня подготовки. Подойдут тем, кто хочет привести тело в форму, улучшить самочувствие и заниматься в комфортной атмосфере."
        photos={[]}
      />
      <StretchingProcess />
      <StretchingPrice />

      <SeoContact
        direction="стретчинг"
        age="для женщин"
        title="Записаться на стретчинг для женщин в Могилёве"
        subtitle="женщин на занятия стретчингом. 
  Это комфортный формат для поддержания формы, мягкого похудения и улучшения самочувствия. 
  Занятия проходят в студии и онлайн в формате закрытой трансляции."
        isForOldForm
      />
    </>
  );
}

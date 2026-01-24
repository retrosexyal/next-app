"use client";

import "@/styles/globals.css";
import { store } from "@/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Footer } from "@/container/footer";
import Header from "@/components/header";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>
          Школа-студия ЛиМи | Обучение хореографии и гимнастики | Могилёв
        </title>
        <meta
          name="description"
          content="Школа-студия ЛиМи в г. Могилёве предлагает профессиональное обучение детей хореографии и гимнастики. Наша студия принимает детей в возрасте от 3х до 14 лет. Качественные занятия, опытные преподаватели и дружеская атмосфера ждут вас в Школе-студии ЛиМи! Мы также приглашаем педагогов в нашу команду."
        />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Школа-студия ЛиМи" />
        <meta
          property="og:title"
          content="Школа-студия ЛиМи | Хореография и гимнастика в Могилёве"
        />
        <meta
          property="og:description"
          content="Профессиональное обучение детей хореографии и гимнастике в Могилёве. Набор от 3 до 14 лет."
        />
        <meta property="og:url" content="https://limistudio.by" />
        <meta
          property="og:image"
          content="https://limistudio.by/og/logo_colored.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ru_RU" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Школа-студия ЛиМи | Хореография и гимнастика"
        />
        <meta
          name="twitter:description"
          content="Обучение детей хореографии и гимнастике в Могилёве. Запись от 3 лет."
        />
        <meta
          name="twitter:image"
          content="https://limistudio.by/og/logo_colored.webp"
        />

        <meta name="yandex-verification" content="f6fd21dc1ea4850e" />
        <meta
          name="keywords"
          content="Школа-студия ЛиМи, Обучение детей хореографии, Гимнастика для детей, Хореография для детей в Могилёве, Гимнастика и танцы для детей, Профессиональные танцевальные занятия, Детская хореография и гимнастика, Школа танцев для детей в Могилёве, Танцевальные занятия от 3 до 16 лет, Уроки танцев и гимнастики для детей, Курсы хореографии и дефиле, Детские танцевальные коллективы, Профессиональные тренеры и преподаватели, Дружеская атмосфера и творческая обстановка, танцы Могилёв, детские танцы, хореография Могилев, гимнастика Могилев, занятия для детей"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Школа-студия ЛиМи",
                url: "https://limistudio.by",
                logo: "https://limistudio.by/og/logo_colored.webp",
                sameAs: [
                  "https://www.instagram.com/limistudio.by/",
                  "https://m.vk.com/limistudio",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: "Школа-студия ЛиМи",
                image: "https://limistudio.by/og/logo_colored.webp",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Могилёв",
                  addressCountry: "BY",
                },
                telephone: "+375291999231",
                priceRange: "12 BYN",
                url: "https://limistudio.by",
              },
            ]),
          }}
        />
      </Head>
      <main className="main">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </main>
    </Provider>
  );
}

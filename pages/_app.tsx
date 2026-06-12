"use client";

import "@/styles/globals.css";
import { store } from "@/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Footer } from "@/container/footer";
import Header from "@/components/header";
import Head from "next/head";
import { useRouter } from "next/router";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  display: "optional",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isWeddingDancePage = router.pathname === "/svadebnyy-tanec";

  const canonicalUrl =
    "https://www.limistudio.by" +
    (router.asPath === "/" ? "" : router.asPath.split("?")[0]);

  const defaultJsonLd = [
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
  ];

  return (
    <Provider store={store}>
      <Head>
        {!isWeddingDancePage && (
          <>
            <title>
              Школа-студия ЛиМи | Обучение хореографии и гимнастике | Могилёв
            </title>
            <meta
              name="description"
              content="Школа-студия ЛиМи в Могилёве предлагает профессиональное обучение детей хореографии, гимнастике и стретчингу. Набор детей от 3 до 14 лет."
              key="description"
            />
            <meta
              name="keywords"
              content="Школа-студия ЛиМи, хореография для детей Могилёв, гимнастика для детей, детские танцы Могилёв, стретчинг для детей, занятия для детей"
              key="keywords"
            />
            <meta property="og:type" content="website" key="og:type" />
            <meta
              property="og:site_name"
              content="Школа-студия ЛиМи"
              key="og:site_name"
            />
            <meta
              property="og:title"
              content="Школа-студия ЛиМи | Хореография и гимнастика в Могилёве"
              key="og:title"
            />
            <meta
              property="og:description"
              content="Профессиональное обучение детей хореографии, гимнастике и стретчингу в Могилёве."
              key="og:description"
            />
            <meta
              property="og:url"
              content="https://limistudio.by"
              key="og:url"
            />
            <meta
              property="og:image"
              content="https://limistudio.by/og/logo_colored.webp"
              key="og:image"
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="ru_RU" />

            <meta
              name="twitter:card"
              content="summary_large_image"
              key="twitter:card"
            />
            <meta
              name="twitter:title"
              content="Школа-студия ЛиМи | Хореография и гимнастика"
              key="twitter:title"
            />
            <meta
              name="twitter:description"
              content="Обучение детей хореографии, гимнастике и стретчингу в Могилёве."
              key="twitter:description"
            />
            <meta
              name="twitter:image"
              content="https://limistudio.by/og/logo_colored.webp"
              key="twitter:image"
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(defaultJsonLd) }}
            />
          </>
        )}

        <meta name="yandex-verification" content="f6fd21dc1ea4850e" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
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
      </Head>
      <main className={`${roboto.className} main`}>
        {!isWeddingDancePage && <Header />}
        <Component {...pageProps} />
        {!isWeddingDancePage && <Footer />}
      </main>
    </Provider>
  );
}

import Head from "next/head";
import { Inter } from "next/font/google";
import Main from "@/components/main";
import { About } from "@/container/about";
import { Ways } from "@/container/ways";
import { Photo } from "@/container/photo";
import { Questions } from "@/container/questions";
import { Reviews } from "@/container/reviews";
import { Footer } from "@/container/footer";
import { Contact } from "@/container/contact";
import { VacanciesPreview } from "@/components/VacanciesPreview";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Школа-студия ЛиМи | Обучение хореографии, гимнастики и дефиле |
          Могилёв
        </title>
        <meta
          name="description"
          content="Школа-студия ЛиМи в г. Могилёве предлагает профессиональное обучение детей хореографии, гимнастики и дефиле. Наша студия принимает детей в возрасте от 3х до 14 лет. Качественные занятия, опытные преподаватели и дружеская атмосфера ждут вас в Школе-студии ЛиМи! Мы также приглашаем педагогов в нашу команду."
        />
        <meta name="yandex-verification" content="f6fd21dc1ea4850e" />
        <meta
          name="keywords"
          content="Школа-студия ЛиМи, Обучение детей хореографии, Гимнастика для детей, Обучение дефиле, Хореография для детей в Могилёве, Гимнастика и танцы для детей, Профессиональные танцевальные занятия, Детская хореография и гимнастика, Школа танцев для детей в Могилёве, Танцевальные занятия от 3 до 16 лет, Уроки танцев и гимнастики для детей, Курсы хореографии и дефиле, Детские танцевальные коллективы, Профессиональные тренеры и преподаватели, Дружеская атмосфера и творческая обстановка, танцы Могилёв, детские танцы, хореография Могилев, гимнастика Могилев, занятия для детей"
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Школа-студия ЛиМи",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Могилёв",
                addressCountry: "BY",
              },
              telephone: "+375291999231",
              priceRange: "12 BYN",
              url: "https://limistudio.by",
            }),
          }}
        />
      </Head>
      <main className="main">
        <Main />
        <About />
        <Ways />
        <Photo />
        <Questions />
        <Reviews />
        <Contact />
        <VacanciesPreview />
      </main>
    </>
  );
}

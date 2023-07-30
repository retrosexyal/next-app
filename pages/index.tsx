import Head from "next/head";
import { Inter } from "next/font/google";
import Form from "@/components/form";
import RegistrationForm from "@/components/registrationForm";
import Admin from "@/components/admin";
import Main from "@/components/main";
import { useEffect, useState } from "react";
import { About } from "@/container/about";
import { scroller, Element } from "react-scroll";
import { Ways } from "@/container/ways";
import { Photo } from "@/container/photo";
import { Questions } from "@/container/questions";
import { Reviews } from "@/container/reviews";
import { Footer } from "@/container/footer";
import { Contact } from "@/container/contact";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // const [isVisible, setIsVisible] = useState(false);

  // let isScrollEnabled = true;
  // let currentIndex = 1;
  // useEffect(() => {
  //   const handleScroll = (e: WheelEvent) => {
  //     console.log(isScrollEnabled);
  //     if (!isScrollEnabled) return;
  //     /* console.log(e.deltaY); */
  //     if (e.deltaY > 0) {
  //       scroller.scrollTo("component2", {
  //         duration: 800,
  //         smooth: true,
  //       });

  //       // scrollToNextComponent();
  //     } else {
  //       scroller.scrollTo("component1", {
  //         duration: 800,
  //         smooth: true,
  //       });
  //     }
  //   };

  //   window.addEventListener("wheel", handleScroll);

  //   return () => {
  //     window.removeEventListener("wheel", handleScroll);
  //   };
  // }, []);
  // const scrollToNextComponent = () => {
  //   isScrollEnabled = false;
  //   setTimeout(() => {
  //     isScrollEnabled = true;
  //   }, 1000);
  //   if (currentIndex === 2) return;
  //   currentIndex++;
  //   const nextComponentName = `component${currentIndex}`;
  //   console.log(nextComponentName);
  //   scroller.scrollTo(nextComponentName, {
  //     duration: 800,
  //     smooth: true,
  //   });
  // };

  return (
    <>
      <Head>
        <title>
          Школа-студия ЛиМи | Обучение хореографии, гимнастики и дефиле |
          Могилёв
        </title>
        <meta
          name="description"
          content="Школа-студия ЛиМи в г. Могилёве предлагает профессиональное обучение детей хореографии, гимнастики и дефиле. Наша студия принимает детей в возрасте от 3х до 16 лет. Качественные занятия, опытные преподаватели и дружеская атмосфера ждут вас в Школе-студии ЛиМи!"
        />
        <meta
          name="keywords"
          content="Школа-студия ЛиМи, Обучение детей хореографии, Гимнастика для детей, Обучение дефиле, Хореография для детей в Могилёве, Гимнастика и танцы для детей, Профессиональные танцевальные занятия, Детская хореография и гимнастика, Школа танцев для детей в Могилёве, Танцевальные занятия от 3 до 16 лет, Уроки танцев и гимнастики для детей, Курсы хореографии и дефиле, Детские танцевальные коллективы, Профессиональные тренеры и преподаватели, Дружеская атмосфера и творческая обстановка, танцы Могилёв, детские танцы, хореография Могилев, гимнастика Могилев, занятия для детей"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <Main />
        <About />
        <Ways />
        <Photo />
        <Questions />
        <Reviews />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

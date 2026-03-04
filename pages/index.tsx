import Main from "@/components/main";
import { About } from "@/container/about";
import { Ways } from "@/container/ways";
import { Photo } from "@/container/photo";
import { Questions } from "@/container/questions";
import { Reviews } from "@/container/reviews";
import { Contact } from "@/container/contact";
import { VacanciesPreview } from "@/components/VacanciesPreview";
import { YoutubeSection } from "@/components/YoutubeSection";
import { StretchingPreview } from "@/components/StretchingPreview";

export default function Home() {
  return (
    <>
      <main className="main">
        <Main />
        <About />
        <Ways />
        <StretchingPreview />
        <Photo />
        <YoutubeSection />
        <Questions />
        <Reviews />
        <Contact />
        <VacanciesPreview />
      </main>
    </>
  );
}

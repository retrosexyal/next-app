import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./slider.module.scss";

export const Slider = () => {
  const [showComponent, setShowComponent] = useState(false);
  const [showComponent1, setShowComponent1] = useState(false);

  const handleSlideChange = (swiper: any) => {
    const activeIndex = swiper.activeIndex;
    if (activeIndex >= 1) {
      setTimeout(() => {
        setShowComponent(true);
      }, 2000);
      // Показываем .component
    } else {
      setShowComponent(false); // Скрываем .component
    }
  };
  const handleWheel = (e: any) => {
    console.log(showComponent);
  };
  return (
    <div style={{ height: "100vh" }}>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => console.log(swiper)}
        direction={"vertical"}
        className={styles.slider}
        mousewheel={true}
        pagination={{
          clickable: true,
        }}
        modules={[Mousewheel, Pagination]}
      >
        <SwiperSlide className={styles.slide}>slide 1</SwiperSlide>
        <SwiperSlide className={styles.slide} onWheel={handleWheel}>
          Slide 2<div className={`${styles.test} test`}>text</div>
          {showComponent && <div className={styles.test2}>text</div>}
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => console.log(swiper)}
            direction={"vertical"}
            className={styles.slider}
            mousewheel={true}
            modules={[Mousewheel, Pagination]}
          >
            <SwiperSlide className={styles.slide} onWheel={handleWheel}>
              Slide 1<div className={`${styles.test} test`}>text</div>
              {showComponent && <div className={styles.test2}>text</div>}
            </SwiperSlide>
            <SwiperSlide className={styles.slide} onWheel={handleWheel}>
              Slide 2<div className={`${styles.test} test`}>text</div>
              {showComponent && <div className={styles.test2}>text</div>}
            </SwiperSlide>
          </Swiper>
        </SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </div>
  );
};
export default Slider;

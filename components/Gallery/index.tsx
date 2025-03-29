import React, { useState, useEffect } from "react";
import style from "./gallery.module.scss";

interface ImageGalleryProps {
  images: string[];
}

export const Gallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerView, setImagesPerView] = useState(3);

  useEffect(() => {
    const updateImagesPerView = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setImagesPerView(3);
      } else if (width >= 768) {
        setImagesPerView(2);
      } else {
        setImagesPerView(1);
      }
    };

    updateImagesPerView();
    window.addEventListener("resize", updateImagesPerView);
    return () => window.removeEventListener("resize", updateImagesPerView);
  }, []);

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - imagesPerView));
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      Math.min(images.length - imagesPerView, prev + imagesPerView)
    );
  };

  const offset = -(currentIndex * (100 / imagesPerView));

  const atStart = currentIndex === 0;
  const atEnd = currentIndex + imagesPerView >= images.length;

  return (
    <div className={style["gallery-container"]}>
      {!atStart && (
        <button
          className={`${style["nav-button"]} ${style.left}`}
          onClick={goPrev}
        >
          ⬅
        </button>
      )}
      <div className={style["image-wrapper"]}>
        <div
          className={style["image-track"]}
          style={{ transform: `translateX(${offset}%)` }}
        >
          {images.map((img, index) => (
            <div key={index} className={style["image-item"]}>
              <img src={img} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {!atEnd && (
        <button
          className={`${style["nav-button"]} ${style.right}`}
          onClick={goNext}
        >
          ➡
        </button>
      )}
    </div>
  );
};

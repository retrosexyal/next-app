import React, { useState, useEffect } from "react";
import style from "./gallery.module.scss";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface ImageGalleryProps {
  images: string[];
}

export const Gallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerView, setImagesPerView] = useState(3);
  const [currentImg, setCurrentImg] = useState<string | null>(null);

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
          <NavigateNextIcon />
        </button>
      )}
      <div className={style["image-wrapper"]}>
        <div
          className={style["image-track"]}
          style={{ transform: `translateX(${offset}%)` }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className={style["image-item"]}
              onClick={() => setCurrentImg(img)}
            >
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
          <NavigateNextIcon />
        </button>
      )}
      {currentImg && (
        <div
          className={style.img_wrapper}
          style={{
            position: "fixed",
            width: "100dvw",
            height: "100dvh",
            background: "rgba(0,0,0,0.5)",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setCurrentImg(null);
          }}
        >
          <img src={currentImg} alt="photo" style={{ objectFit: "contain" }} />
        </div>
      )}
    </div>
  );
};

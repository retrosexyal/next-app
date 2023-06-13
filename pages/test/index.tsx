import React, { useEffect, useState } from "react";
import styles from "./test.module.scss";

const MyComponent = () => {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [visibleIndexClass, setVisibleIndexClass] = useState(-1);

  const componentsCount = 3;
  let countWheel = 0;

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      setTimeout(() => {
        countWheel++;
        if (countWheel > 4) {
          console.log(countWheel);
        }
      }, 2000);
      if (countWheel > 10) {
        if (event.deltaY > 0) {
          if (visibleIndex < componentsCount - 1) {
            setTimeout(() => {
              setVisibleIndex(visibleIndex + 1);
              setTimeout(() => {
                setVisibleIndexClass(visibleIndex + 1);
              }, 100);
            }, 100);
          }
        } else {
          if (visibleIndex > 0) {
            setTimeout(() => {
              setVisibleIndexClass(visibleIndex - 1);
              setTimeout(() => {
                setVisibleIndex(visibleIndex - 1);
              }, 500);
            }, 100);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [visibleIndex]);

  return (
    <div>
      <div className={styles.wrapper}>
        {visibleIndex > 1 && (
          <div className={`${visibleIndexClass > 1 ? styles.shine : ""}`}></div>
        )}
        {visibleIndex > -1 && <div>test1</div>}
        {visibleIndex > 0 && (
          <div
            className={`${styles.test} ${
              visibleIndexClass > 0 ? styles.test2 : ""
            }`}
          >
            test2
          </div>
        )}
        {visibleIndex > 1 && <div>test3</div>}
      </div>
    </div>
  );
};

export default MyComponent;

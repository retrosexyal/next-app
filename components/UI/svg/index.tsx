import React from "react";

interface IProps {
  type: string;
  width?: string;
  height?: string;
  fill?: string;
}

export const Svg: React.FC<IProps> = ({ type, width, height, fill }) => {
  return (
    <>
      {type.toLowerCase() === "vk" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width={width || "48px"}
          height={height || "48px"}
        >
          <path
            fill="#1976d2"
            d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5 V37z"
          />
          <path
            fill={fill || "#fff"}
            d="M35.937,18.041c0.046-0.151,0.068-0.291,0.062-0.416C35.984,17.263,35.735,17,35.149,17h-2.618 c-0.661,0-0.966,0.4-1.144,0.801c0,0-1.632,3.359-3.513,5.574c-0.61,0.641-0.92,0.625-1.25,0.625C26.447,24,26,23.786,26,23.199 v-5.185C26,17.32,25.827,17,25.268,17h-4.649C20.212,17,20,17.32,20,17.641c0,0.667,0.898,0.827,1,2.696v3.623 C21,24.84,20.847,25,20.517,25c-0.89,0-2.642-3-3.815-6.932C16.448,17.294,16.194,17,15.533,17h-2.643 C12.127,17,12,17.374,12,17.774c0,0.721,0.6,4.619,3.875,9.101C18.25,30.125,21.379,32,24.149,32c1.678,0,1.85-0.427,1.85-1.094 v-2.972C26,27.133,26.183,27,26.717,27c0.381,0,1.158,0.25,2.658,2c1.73,2.018,2.044,3,3.036,3h2.618 c0.608,0,0.957-0.255,0.971-0.75c0.003-0.126-0.015-0.267-0.056-0.424c-0.194-0.576-1.084-1.984-2.194-3.326 c-0.615-0.743-1.222-1.479-1.501-1.879C32.062,25.36,31.991,25.176,32,25c0.009-0.185,0.105-0.361,0.249-0.607 C32.223,24.393,35.607,19.642,35.937,18.041z"
          />
        </svg>
      )}
      {type.toLowerCase() === "inst" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width={width || "48px"}
          height={height || "48px"}
        >
          <radialGradient
            id="yOrnnhliCrdS2gy~4tD8ma"
            cx="19.38"
            cy="42.035"
            r="44.899"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#fd5" />
            <stop offset=".328" stop-color="#ff543f" />
            <stop offset=".348" stop-color="#fc5245" />
            <stop offset=".504" stop-color="#e64771" />
            <stop offset=".643" stop-color="#d53e91" />
            <stop offset=".761" stop-color="#cc39a4" />
            <stop offset=".841" stop-color="#c837ab" />
          </radialGradient>
          <path
            fill="url(#yOrnnhliCrdS2gy~4tD8ma)"
            d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
          />
          <radialGradient
            id="yOrnnhliCrdS2gy~4tD8mb"
            cx="11.786"
            cy="5.54"
            r="29.813"
            gradientTransform="matrix(1 0 0 .6663 0 1.849)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#4168c9" />
            <stop offset=".999" stop-color="#4168c9" stopOpacity="0" />
          </radialGradient>
          <path
            fill="url(#yOrnnhliCrdS2gy~4tD8mb)"
            d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
          />
          <path
            fill={fill || "#fff"}
            d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
          />
          <circle cx="31.5" cy="16.5" r="1.5" fill="#fff" />
          <path
            fill={fill || "#fff"}
            d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
          />
        </svg>
      )}
    </>
  );
};

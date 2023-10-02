import React, { ChangeEvent, useState } from "react";
import styles from "./styled-input.module.scss";

interface IProps {
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  isSelect?: boolean;
  options?: string[];
}

export const StyledInput: React.FC<IProps> = ({
  type,
  value,
  onChange,
  placeholder,
  className,
  isSelect = false,
  options,
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    onChange(e as ChangeEvent<HTMLInputElement>);
  };
  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };
  return (
    <div className={styles.wrapper}>
      {!isSelect && (
        <input
          type={type}
          className={styles.input + " " + className}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
      {isSelect && (
        <select
          className={styles.input + " " + className}
          value={value}
          onChange={handleChange}
          placeholder=""
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <option disabled selected value=""></option>
          {options?.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      )}
      {
        <div
          className={
            styles.placeholder + " " + (value || isActive) ? styles.active : ""
          }
        >
          {placeholder}
        </div>
      }
    </div>
  );
};

import React, { useState } from "react";
import styles from "./header.module.scss";
import Login from "../login";
import Button from "../button";

interface IProps {
  className: string;
}

const Header: React.FC<IProps> = ({ className }) => {
  const [isActive, setIsActive] = useState(false);

  const handleLogin = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsActive(!isActive);
  };
  return (
    <div className={`wrapper ${className}`}>
      <div className={styles.content_wrapper}>
        <h2 className={styles.title}>ЛиМи</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
            <button onClick={handleLogin}>Login</button>
          </ul>
        </nav>
      </div>
      {isActive && <Login handleLogin={handleLogin} />}
    </div>
  );
};

export default Header;

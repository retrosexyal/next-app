import React, { useState } from "react";
import styles from "./header.module.scss";
import Login from "../login";

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
        <h1 className={styles.title}>ЛиМи</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li onClick={handleLogin}>Login</li>
            <li>Logout</li>
          </ul>
        </nav>
      </div>
      {isActive && <Login handleLogin={handleLogin} />}
    </div>
  );
};

export default Header;

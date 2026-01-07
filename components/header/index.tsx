import React, { useState } from "react";
import styles from "./header.module.scss";
import Login from "../login";
import { Link as ScrollLink } from "react-scroll";
import { data } from "./constants";
import { Burger } from "../burger";

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const handleLogin = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsActive(!isActive);
  };

  return (
    <div className={styles.content}>
      <div className="wrapper">
        <div className={styles.content_wrapper}>
          <h2 className={styles.title}>
            <ScrollLink
              activeClass="active"
              to="main"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              ЛиМи
            </ScrollLink>
          </h2>
          <nav>
            <Burger />

            <ul className={styles.list}>
              {data.map((el) => {
                return (
                  <ScrollLink
                    key={el.id}
                    className={styles.list_item}
                    activeClass="active"
                    to={el.id}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    {el.text}
                  </ScrollLink>
                );
              })}
              <li className={styles.list_item} onClick={handleLogin}>
                Личный кабинет
              </li>
            </ul>
          </nav>
        </div>
        {isActive && <Login handleLogin={handleLogin} />}
      </div>
    </div>
  );
};

export default Header;

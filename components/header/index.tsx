import React, { useState } from "react";
import styles from "./header.module.scss";
import Login from "../login";
import { Link as ScrollLink } from "react-scroll";
import { data } from "./constants";
import { Burger } from "../burger";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  const isHomePage = router.pathname === "/";

  const handleLogin = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.content}>
      <div className="wrapper">
        <div className={styles.content_wrapper}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo-header.png"
              width={2116}
              height={1547}
              alt="logo limistudio"
              priority
            />
          </Link>

          <nav>
            <Burger />

            <ul className={styles.list}>
              {data.map(({ id, text, href }) => {
                return (
                  <li key={`${id}${text}`} className={styles.list_item}>
                    {isHomePage ? (
                      <ScrollLink
                        activeClass="active"
                        to={id}
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                      >
                        {text}
                      </ScrollLink>
                    ) : (
                      <Link href={href}>{text}</Link>
                    )}
                  </li>
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

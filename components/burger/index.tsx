import React, { ReactComponentElement, ReactElement, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { data } from "../header/constants";
import Login from "../login";
import style from "./burger.module.scss";

export const Burger = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isActive, setIsActive] = useState(false);

  const handleLogin = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsActive(!isActive);
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className={style.burger}
      >
        <span
          className={`${style.line} ${style.line1} ${
            open ? style.line1op : ""
          }`}
        ></span>
        <span
          className={`${style.line} ${style.line2} ${
            open ? style.line2op : ""
          }`}
        ></span>
        <span
          className={`${style.line} ${style.line3} ${
            open ? style.line3op : ""
          }`}
        ></span>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {data.map((el) => {
          return (
            <MenuItem onClick={handleClose} key={el.id}>
              <ScrollLink
                onClick={handleClose}
                activeClass="active"
                to={el.id}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                {el.text}
              </ScrollLink>
            </MenuItem>
          );
        })}
        <MenuItem onClick={handleClose}>
          <li onClick={handleLogin}>Личный кабинет</li>
        </MenuItem>
      </Menu>
      {isActive && <Login handleLogin={handleLogin} />}
    </div>
  );
};

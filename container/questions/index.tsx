import React from "react";
import style from "./questions.module.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Title } from "@/components/UI/title";
import { data } from "./constants";

export const Questions = () => {
  return (
    <div className={`${style.wrapper} wrapper`} id="questions">
      <Title text="Ответы на популярные вопросы" />
      {data.map((e) => {
        return (
          <React.Fragment key={e.title}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={e.title}
                id={e.title}
              >
                <Typography>{e.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{e.subtitle}</Typography>
              </AccordionDetails>
            </Accordion>
          </React.Fragment>
        );
      })}
    </div>
  );
};

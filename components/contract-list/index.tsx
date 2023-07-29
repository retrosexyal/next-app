import React from "react";
import styles from "./contract-list.module.scss";
import ContractService from "@/clientServices/ContractService";
import { IInfo } from "@/interface/iContact";

export const ContractList = ({ info }: { info: IInfo }) => {
  const handleSubmit = () => {
    try {
      ContractService.addContract(info);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={styles.wrapper}>
      <p className={styles.center}>ДОГОВОР № _________</p>
      <div className={styles.flex}>
        <p>г. Могилев</p>
        <p>«___» _________ 20__г. </p>
      </div>
      <p className={styles.redP}>
        {`Индивидуальный предприниматель Михеенко Елизавета Александровна,
        руководитель школы- студии «ЛиМи» (в дальнейшем – Танцевальная студия),
        действующая на основании свидетельства с регистрационным номером
        791192337 от 09 июля 2019 г., с одной стороны, и ${info.FIOP} ( в
        дальнейшем - Родитель), с другой стороны, заключили настоящий договор о
        нижеследующем:`}
      </p>
      <p className={styles.center}>1. ПРЕДМЕТ ДОГОВОРА</p>
      <p className={styles.redP}>
        {`1.1. Танцевальная студия предоставляет услуги по проведению групповых занятий с ребенком 
Родителя по программам с использованием материально-технической базы Танцевальной студии.`}
      </p>
      <p className={styles.redP}>
        {`1.2. Форма занятий:  занятия, проводимые в соответствии с расписанием, утвержденным 
руководителем Танцевальной студии.`}
      </p>
      <p className={styles.redP}>
        {`1.3. Договор заключается в интересах несовершеннолетнего ребенка`}
        <p>{`(ФИО ребёнка) ${info.FIOC}`}</p>
        <p>{`(Дата рождения ребёнка) ${info.dateB}`}</p>
        <p>{`(Наличие хронических заболеваний у ребёнка) ${info.desiases}`}</p>
      </p>

      <p className={styles.redP}>
        {`1.4. Зал Танцевальной студии, направление занятий`}
        <p>{`${info.place}`}</p>
      </p>
      <p className={styles.redP}>
        {`1.5. Родитель выбирает группу, в которой будет заниматься ребенок. Возраст ребенка должен 
соответствовать возрасту, на который рассчитана программа занятий группы.`}
      </p>
      <p className={styles.center}>2. СУММА ДОГОВОРА И ПОРЯДОК РАСЧЕТОВ</p>
      <p
        className={styles.redP}
      >{`2.1. Стоимость разового занятия - 8 рублей, абонемент на месяц, включающий 8 занятий - 56 рублей.`}</p>
      <p
        className={styles.redP}
      >{`2.2. Плата осуществляется в день занятия и непосредственно до его начала. Плата позже указанного срока должна быть согласована с Танцевальной студией. В случае отсутствия платы, Танцевальная студия оставляет за собой право отказать Родителю в посещении занятия ребёнком.`}</p>
      <p
        className={styles.redP}
      >{`2.3. Танцевальная студия работает по абонементной системе с возможностью оплаты разового 
занятия. Родитель оплачивает 8 (восемь) занятий вперед.`}</p>
      <p
        className={styles.redP}
      >{`2.4. Занятия, пропущенные по уважительной причине, сохраняются, тем самым продлевая срок действия абонемента. Уважительной причиной считается справка от врача. Родитель предупреждает об отсутствии ребенка на занятиях не позднее 1 (одного) часа до начала занятий. Занятия, пропущенные по неуважительной причине, не отрабатываются и не переносятся.`}</p>
      <p className={styles.center}>3. ОБЯЗАННОСТИ СТОРОН</p>
      <p
        className={styles.redP}
      >{`3.1. Танцевальная студия обязуется организовать занятия в установленный срок и в соответствии с 
      программой, с использованием материально-технической базы Танцевальной студии.`}</p>
      <p
        className={styles.redP}
      >{`3.2. Сохранить за ребенком его место в группе в случае, если ребенок не будет посещать занятия в 
      летние месяцы.`}</p>
      <p
        className={styles.redP}
      >{`3.3. Родитель обязуется произвести оплату занятий в Танцевальной студии до фактического начала 
      занятий.`}</p>
      <p
        className={styles.redP}
      >{`3.4. Родитель обязуется обеспечить регулярное посещение ребенком занятий.`}</p>
      <p
        className={styles.redP}
      >{`3.5. В обязанности Родителя входит сопровождение ребенка до места проведения занятий в 
      установленное время, по прибытию лично передать ребенка руководителю Танцевальной студии, а по 
      окончании занятий, лично забрать ребенка.`}</p>
      <p
        className={styles.redP}
      >{`3.6. Присутствие Родителя на занятиях с ребенком в возрасте до 3-х лет обязательно.`}</p>
      <p
        className={styles.redP}
      >{`3.7. Родитель обязан уведомить руководителя Танцевальной студии об имеющихся у ребенка 
      медицинских противопоказаниях для занятий (физических нагрузок). В случае сокрытия 
      соответствующей информации, Танцевальная студия ответственности не несет.`}</p>
      <p className={styles.center}>4. ПРОЧЕЕ</p>
      <p
        className={styles.redP}
      >{`4.1. На занятиях необходимо присутствовать в танцевальной обуви и соответствующей форме 
      одежды.Волосы ребёнка должны быть убраны.`}</p>
      <p
        className={styles.redP}
      >{`4.2. Руководитель Танцевальной студии оставляет за собой право не допускать к занятиям ребенка с 
      признаками недомогания, симптомами ОРВИ, или иного заболевания. Занятие считается пропущенным 
      по болезни и может быть перенесено без предъявления справки от врача.
      `}</p>
      <p className={styles.redP}>{`
      4.3. Руководитель Танцевальной студии оставляет за собой право отстранить от занятий ребенка в 
      случае его, ребенка, немотивированного агрессивного поведения. В этом случае плата за не 
      проведенное занятие возвращается Родителю.
      `}</p>
      <p className={styles.redP}>{`
      4.4. Студия не несет ответственности за полученные травмы во время занятий.
      `}</p>
      <p className={styles.redP}>{`
      4.5. Родитель, оплачивая занятия, оплачивает процесс обучения, но не место ребёнка в концертном составе. Танцевальная студия оставляет за собой право отказать Родителю ребёнка в участии в танцевальном выступлении, если ребёнок не готов к данному концерту.
      `}</p>
      <p className={styles.center}>
        5. СРОК ДЕЙСТВИЯ ДОГОВОРА И ЮРИДИЧЕСКИЕ АДРЕСА СТОРОН
      </p>
      <p className={styles.redP}>{`
      5.1. Договор считается заключенным с момента его подписания и действует до 31.08.24г. Стороны имеют право в одностороннем порядке расторгнуть настоящий договор, уведомив вторую сторону за 1 (один) календарный день.
      `}</p>
      <div className={styles.flex}>
        <p>
          <div className={styles.center}>ТАНЦЕВАЛЬНАЯ СТУДИЯ:</div>
          <div>Индивидуальный предприниматель</div>
          <div>Михеенко Елизавета Александровна,</div>
          <div>212020, г. Могилев, ул. Подгорная, 104</div>
          <div>lizaveta.miheenko@mail.ru</div>
          <div>limistudio.by</div>
          <div>+375(29) 1-99-92-31</div>
          <div>Е.А.Михеенко</div>
        </p>
        <p>
          <div className={styles.center}>РОДИТЕЛЬ:</div>
          <div>{`Ф.И.О. ${info.FIOP}`}</div>
          <div>{`Серия паспорта: ${info.KB}`}</div>
          <div>{`Когда выдан: ${info.datePass}`}</div>
          <div>{`Кем выдан: ${info.whoPass}`}</div>
          <div>{`Тел.моб.: ${info.phone}`}</div>
        </p>
      </div>
      <button onClick={handleSubmit}>отправить на подпись</button>
    </div>
  );
};
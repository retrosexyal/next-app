import styles from "../StudentAttendanceCalendar.module.scss";

export default function Calendar({ lessons }: { lessons: { date: string; present: boolean }[] }) {
  const today = new Date(Date.now() + 3 * 3600000);
  const year = today.getUTCFullYear() - (today.getUTCMonth() < 8 ? 1 : 0);
  const months: Date[] = [];
  for (let date = new Date(Date.UTC(year, 8, 1)); date <= today; date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))) months.push(date);
  const byDay = new Map<string, boolean[]>();
  lessons.forEach(l => {
    const key = new Date(new Date(l.date).getTime() + 3 * 3600000).toISOString().slice(0, 10);
    byDay.set(key, [...(byDay.get(key) || []), l.present]);
  });
  return <div className={styles.months}>{months.map(month => {
    const key = month.toISOString().slice(0, 7);
    const offset = (month.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
    return <section className={styles.month} key={key}>
      <h3>{month.toLocaleDateString("ru-RU", { month: "long", year: "numeric", timeZone: "UTC" })}</h3>
      <div className={styles.grid}>
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => <span className={styles.weekday} key={day}>{day}</span>)}
        {Array.from({ length: offset }, (_, i) => <span key={`offset-${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const date = `${key}-${String(i + 1).padStart(2, "0")}`;
          const marks = byDay.get(date) || [];
          const present = marks.filter(Boolean).length;
          const status = marks.length ? present === marks.length ? styles.present : present === 0 ? styles.absent : styles.mixed : "";
          const label = marks.length ? `посещений: ${present}, пропусков: ${marks.length - present}` : "занятий нет";
          return <div className={`${styles.day} ${status}`} key={date} aria-label={`${date}: ${label}`} title={label}>{i + 1}</div>;
        })}
      </div>
    </section>;
  })}</div>;
}

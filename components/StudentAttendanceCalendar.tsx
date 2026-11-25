import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import styles from "./StudentAttendanceCalendar.module.scss";

type Visit = { id: string; date: string; group: string; present: boolean };
export default function StudentAttendanceCalendar({ student, from, onClose }: { student: { id: string; fullName: string }; from: string; onClose: () => void }) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(false);
    fetch(`/api/admin/students?${new URLSearchParams({ studentId: student.id, ...(from ? { from } : {}) })}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, signal: controller.signal,
    }).then(async response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => { if (!controller.signal.aborted) setVisits(data.visits); })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [student.id, from, retry]);
  const today = new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10);
  const start = from || visits[0]?.date || today;
  const months: string[] = [];
  for (let year = Number(start.slice(0, 4)), month = Number(start.slice(5, 7)); `${year}-${String(month).padStart(2, "0")}` <= today.slice(0, 7);) {
    months.push(`${year}-${String(month).padStart(2, "0")}`);
    if (++month > 12) { month = 1; year++; }
  }
  const byDay = new Map<string, Visit[]>();
  visits.forEach(v => byDay.set(v.date, [...(byDay.get(v.date) || []), v]));
  return <Dialog open onClose={onClose} fullWidth maxWidth="lg" scroll="paper">
    <DialogTitle><div className={styles.heading}><span>{student.fullName}<small>Календарь посещаемости</small></span><Button onClick={onClose}>Закрыть</Button></div></DialogTitle>
    <DialogContent>
      {loading ? <p role="status">Загружаем календарь…</p> : error ? <p role="alert">Не удалось загрузить календарь. <Button onClick={() => setRetry(r => r + 1)}>Повторить</Button></p> : <>
        <p className={styles.legend}><span>🟢 Присутствовал: {visits.filter(v => v.present).length}</span><span>🔴 Пропустил: {visits.filter(v => !v.present).length}</span><span>Без цвета — занятий нет</span></p>
        {!visits.length && <p>За выбранный период занятий нет.</p>}
        <div className={styles.months}>{months.map(key => {
          const [year, month] = key.split("-").map(Number);
          const first = new Date(Date.UTC(year, month - 1, 1));
          const offset = (first.getUTCDay() + 6) % 7;
          const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
          return <section className={styles.month} key={key}><h3>{first.toLocaleDateString("ru-RU", { month: "long", year: "numeric", timeZone: "UTC" })}</h3>
            <div className={styles.grid}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => <span className={styles.weekday} key={d}>{d}</span>)}
              {Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} />)}
              {Array.from({ length: days }, (_, i) => {
                const date = `${key}-${String(i + 1).padStart(2, "0")}`;
                const marks = byDay.get(date) || [];
                const present = marks.filter(v => v.present).length;
                return <div key={date} className={`${styles.day} ${marks.length ? present === marks.length ? styles.present : present === 0 ? styles.absent : styles.mixed : ""}`} title={marks.map(v => `${v.group}: ${v.present ? "присутствовал" : "пропустил"}`).join("\n")}>
                  <span>{i + 1}</span>{marks.map(v => <small key={v.id} aria-label={`${v.group}: ${v.present ? "присутствовал" : "пропустил"}`}>{v.present ? "✓" : "×"}</small>)}
                </div>;
              })}
            </div>
            {visits.filter(v => v.date.startsWith(key)).map(v => <div className={styles.entry} key={v.id}><span>{v.date.slice(8)} · {v.group}</span><strong className={v.present ? styles.green : styles.red}>{v.present ? "✓ Был" : "× Пропуск"}</strong></div>)}
          </section>;
        })}</div>
      </>}
    </DialogContent>
  </Dialog>;
}

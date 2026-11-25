import StudentAttendanceCalendar from "@/components/StudentAttendanceCalendar";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCheckAdmin } from "@/hooks/useCheckAdmin";
import styles from "./students.module.scss";

type Student = { hidden: boolean; id: string; fullName: string; phone?: string; groups: string[]; memberships: { id: string; title: string; joinedAt: string | null }[]; total: number; present: number; percent: number | null; lastVisit: string | null; subscription: { remaining: number; total: number; expired: boolean } | null };
export default function Students() {
  const isAdmin = useCheckAdmin();
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [calendarStudent, setCalendarStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [sort, setSort] = useState("percent");
  const [direction, setDirection] = useState("desc");
  const [from, setFrom] = useState(() => {
    const today = new Date(Date.now() + 3 * 3600000);
    const year = today.getUTCFullYear() - (today.getUTCMonth() < 8 ? 1 : 0);
    return `${year}-09-01`;
  });
  const [showHidden, setShowHidden] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [visibilityError, setVisibilityError] = useState("");
  const changeVisibility = async (student: Student) => {
    setSaving(student.id); setVisibilityError("");
    try {
      const response = await fetch("/api/admin/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ id: student.id, hidden: !student.hidden }),
      });
      if (!response.ok) throw new Error();
      setStudents(items => items.map(s => s.id === student.id ? { ...s, hidden: !student.hidden } : s));
    } catch { setVisibilityError("Не удалось изменить видимость студента. Попробуйте ещё раз."); }
    finally { setSaving(null); }
  };
  const requestId = useRef(0);
  const load = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/admin/students${from ? `?${new URLSearchParams({ from })}` : ""}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (!response.ok) throw new Error("Не удалось загрузить студентов");
      const data = await response.json();
      if (current === requestId.current) setStudents(data);
    } catch { if (current === requestId.current) setError("Не удалось загрузить студентов. Попробуйте ещё раз."); }
    finally { if (current === requestId.current) setLoading(false); }
  }, [from]);
  useEffect(() => { if (isAdmin) void load(); return () => { requestId.current++; }; }, [isAdmin, load]);
  if (!isAdmin) return null;
  const sortValue = (s: Student): number | null => {
    if (sort === "percent") return s.percent;
    if (sort === "lastVisit") return s.lastVisit ? Date.parse(s.lastVisit) : null;
    if (sort === "joined") {
      const dates = s.memberships.filter(m => (!group || m.title === group) && m.joinedAt).map(m => Date.parse(m.joinedAt!)).filter(Number.isFinite);
      return dates.length ? Math.min(...dates) : null;
    }
    if (sort === "remaining") return s.subscription?.remaining ?? null;
    if (sort === "missed") return s.total - s.present;
    return sort === "present" ? s.present : s.total;
  };
  const visibleStudents = students.filter(s => showHidden || !s.hidden);
  const filtered = visibleStudents.filter(s => (!group || s.groups.includes(group)) && `${s.fullName} ${s.phone || ""}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
    const name = a.fullName.localeCompare(b.fullName, "ru", { numeric: true });
    if (sort === "name") return direction === "asc" ? name : -name;
    const av = sortValue(a), bv = sortValue(b);
    if (av === null) return bv === null ? name : 1;
    if (bv === null) return -1;
    return (direction === "asc" ? av - bv : bv - av) || name;
  });
  return <main className={styles.page}>
    <Head><title>Студенты · Администратор</title><meta name="robots" content="noindex, nofollow" /></Head>
    <nav><Link href="/admin">Админка</Link><Link href="/admin/groups">Группы</Link><span aria-current="page">Студенты</span></nav>
    <header><div><p>ОБЗОР ОБУЧЕНИЯ</p><h1>Студенты</h1></div><button onClick={load} disabled={loading}>Обновить</button></header>
    <div className={styles.period}><label htmlFor="attendance-from">Считать посещаемость с</label><input id="attendance-from" type="date" value={from} onChange={e => setFrom(e.target.value)} /><button onClick={() => setFrom("")} disabled={!from}>За всё время</button></div>
    <p className={styles.note}>{from ? `С ${from.split("-").reverse().join(".")} включительно` : "За всё время"} · Только прошедшие занятия. Учитываются все созданные занятия группы с выбранной даты, в том числе до добавления студента. Отсутствие отметки считается пропуском. Возвращённые занятия не считаются посещением. Для студентов без текущей группы учитываются занятия исторических групп за весь выбранный период до сегодня. Дни без созданных занятий не учитываются. Остаток абонемента — текущий, последний визит — за выбранный период.</p>
    {!loading && !error && <div className={styles.summary}><div><strong>{visibleStudents.length}</strong>Студентов в списке</div><div><strong>{visibleStudents.filter(s => s.total > 0).length}</strong>Есть история занятий</div><div><strong>{visibleStudents.filter(s => s.subscription && !s.subscription.expired && s.subscription.remaining > 0).length}</strong>С активным абонементом</div></div>}
    <div className={styles.filters}>
      <input aria-label="Поиск студента" placeholder="Имя или телефон" value={search} onChange={e => setSearch(e.target.value)} />
      <label>Группа<select value={group} onChange={e => setGroup(e.target.value)}><option value="">Все группы</option>{Array.from(new Set(students.flatMap(s => s.groups))).sort().map(g => <option key={g}>{g}</option>)}</select></label>
      <label>Сортировать по<select value={sort} onChange={e => setSort(e.target.value)}><option value="name">Имени</option><option value="percent">Проценту посещаемости</option><option value="present">Числу посещений</option><option value="total">Всего занятий</option><option value="missed">Числу пропусков</option><option value="lastVisit">Дате последнего визита</option><option value="joined">Дате добавления в группу</option><option value="remaining">Остатку абонемента</option></select></label>
      <label>Порядок<select value={direction} onChange={e => setDirection(e.target.value)}><option value="asc">{sort === "name" ? "А → Я" : sort === "joined" || sort === "lastVisit" ? "Сначала старые" : "По возрастанию"}</option><option value="desc">{sort === "name" ? "Я → А" : sort === "joined" || sort === "lastVisit" ? "Сначала новые" : "По убыванию"}</option></select></label>
    </div>
    <label className={styles.hiddenToggle}><input type="checkbox" checked={showHidden} onChange={e => setShowHidden(e.target.checked)} />Показать скрытых ({students.filter(s => s.hidden).length})</label>
    {visibilityError && <p role="alert">{visibilityError}</p>}
    {loading ? <p role="status">Загружаем студентов…</p> : error ? <p role="alert">{error} <button onClick={load}>Повторить</button></p> : <>
      <p className={styles.note}>Найдено: {filtered.length}</p>
      {sort === "joined" && <p className={styles.note}>Дата добавления: для выбранной группы, а при выборе всех групп — самая ранняя из сохранённых дат. Студенты без даты находятся в конце списка.</p>}
      {filtered.length === 0 ? <p>Студенты не найдены</p> : <table className={styles.table}><thead><tr>{["№", "Студент", "Посещаемость", "Занятия", "Абонемент", "Последний визит", "Действия"].map(t => <th key={t}>{t}</th>)}</tr></thead><tbody>{filtered.map((s, index) => <tr key={s.id} className={expandedStudent === s.id ? styles.expandedRow : undefined}>
        <td className={styles.rowNumber} data-label="№">{index + 1}</td>
        <td className={styles.studentName}><button className={styles.nameButton} onClick={() => setCalendarStudent(s)} aria-label={`Календарь посещаемости: ${s.fullName}`}>{s.fullName}</button><button className={styles.mobileDetails} aria-expanded={expandedStudent === s.id} aria-label={`Подробнее: ${s.fullName}`} onClick={() => setExpandedStudent(id => id === s.id ? null : s.id)}>{expandedStudent === s.id ? "Свернуть" : "Подробнее"}</button><div className={styles.studentMeta}>{s.hidden && <small>Скрыт из списка</small>}{s.memberships.length ? s.memberships.map(g => <small key={g.id}>{g.title} · Добавлен: {g.joinedAt ? new Date(g.joinedAt).toLocaleDateString("ru-RU", { timeZone: "Europe/Minsk" }) : "дата не сохранена"}</small>) : <small>Без группы</small>}{s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}</div></td>
        <td data-label="Посещаемость"><strong>{s.percent === null ? "Нет данных" : `${s.percent}%`}</strong>{s.percent !== null && <progress max={100} value={s.percent} aria-label="Процент присутствия" />}</td>
        <td data-label="Занятия"><strong>{s.present} из {s.total}</strong><small>Пропущено: {s.total - s.present}</small></td>
        <td data-label="Абонемент">{s.subscription ? <><strong>{s.subscription.remaining} из {s.subscription.total}</strong><small>{s.subscription.expired ? "Срок истёк" : s.subscription.remaining ? "Осталось занятий" : "Исчерпан"}</small></> : "Нет активного"}</td>
        <td data-label="Последний визит">{s.lastVisit ? new Date(s.lastVisit).toLocaleDateString("ru-RU", { timeZone: "Europe/Minsk" }) : "—"}</td>
        <td data-label="Действия"><button disabled={saving !== null} onClick={() => changeVisibility(s)} aria-label={`${s.hidden ? "Показать" : "Скрыть"} студента ${s.fullName}`}>{saving === s.id ? "Сохраняем…" : s.hidden ? "Показать" : "Скрыть"}</button></td>
      </tr>)}</tbody></table>}
    </>}
    {calendarStudent && <StudentAttendanceCalendar student={calendarStudent} from={from} onClose={() => setCalendarStudent(null)} />}
  </main>;
}






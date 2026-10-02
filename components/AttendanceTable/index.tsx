import { useEffect, useState } from "react";
import Image from "next/image";

import api from "@/http";
import styles from "./AttendanceTable.module.scss";

type LessonDetails = {
  id: string;
  date: string;
  groupTitle: string;
  present: boolean;
};

type StudentAttendance = {
  id: string;
  fullName: string;
  groups: { id: string; title: string }[];
  percentage: number;
  presentCount: number;
  missedCount: number;
  totalLessons: number;
  remainingLessons: number;
  hasActiveSubscription: boolean;
  lessons: LessonDetails[];
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Minsk",
  }).format(new Date(value));

export function AttendanceTable() {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [selected, setSelected] = useState<StudentAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api
      .get<{ students: StudentAttendance[] }>("/api/attendance/my")
      .then(({ data }) => {
        if (active) setStudents(data.students || []);
      })
      .catch(() => {
        if (active) setError("Не удалось загрузить посещаемость");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  if (loading) {
    return <div className={styles.state}>Загружаем посещаемость…</div>;
  }

  if (error) return <div className={styles.error}>{error}</div>;
  if (!students.length) return null;

  return (
    <>
    <section className={styles.subscriptionSection} aria-labelledby="subscription-title">
      <div className={styles.heading}>
        <h2 id="subscription-title">Абонемент</h2>
        <p>Остаток занятий и история посещений</p>
      </div>
      <div className={styles.subscriptionCards}>
        {students.map((student) => (
          <article className={styles.subscriptionCard} key={student.id}>
            <div className={styles.cardHeader}>
              <div className={styles.logoBox}>
                <Image src="/logo-header.png" alt="Школа-студия ЛиМи" width={88} height={60} style={{ objectFit: "contain" }} />
              </div>
              <span className={styles.cardStatus}>
                {student.hasActiveSubscription ? "Действующий абонемент" : "Нет действующего абонемента"}
              </span>
            </div>
            <h3 className={styles.cardName}>{student.fullName}</h3>
            <div className={styles.cardGroups}>
              {student.groups?.map((group) => <span key={group.id}>{group.title}</span>)}
            </div>
            <div className={styles.balance}>
              <strong>{student.remainingLessons}</strong>
              <span>занятий осталось</span>
            </div>
            <details className={styles.cardHistory}>
              <summary>История посещений <span>{student.lessons.length}</span></summary>
              <p className={styles.historyNote}>Занятия во всех текущих группах</p>
              {student.lessons.length ? (
                <div className={styles.cardLessonList}>
                  {student.lessons.map((lesson) => (
                    <div className={styles.cardLesson} key={lesson.id}>
                      <div><strong>{formatDate(lesson.date)}</strong><span>{lesson.groupTitle}</span></div>
                      <span className={lesson.present ? styles.present : styles.absent}>
                        {lesson.present ? "Присутствовал" : "Отсутствовал"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : <p className={styles.historyNote}>Занятий пока нет.</p>}
            </details>
          </article>
        ))}
      </div>
    </section>
    <section className={styles.section} aria-labelledby="attendance-title">
      <div className={styles.heading}>
        <div>
          <h2 id="attendance-title">Посещаемость</h2>
          <p>По всем проведённым занятиям в текущих группах</p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ученик</th>
              <th>Посещаемость</th>
              <th>Пропущено</th>
              <th aria-label="Действия" />
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td data-label="Ученик">
                  {student.fullName}
                  <div className={styles.groupNames}>
                    {student.groups?.length
                      ? student.groups.map((group) => (
                          <span key={group.id}>{group.title}</span>
                        ))
                      : "Не состоит в группах"}
                  </div>
                </td>
                <td data-label="Посещаемость">
                  <span
                    className={`${styles.percentage} ${student.percentage >= 50 ? styles.good : student.percentage > 20 ? styles.middle : styles.bad}`}
                  >
                    {student.percentage}%
                  </span>
                  <span className={styles.count}>
                    {student.presentCount} из {student.totalLessons}
                  </span>
                </td>
                <td data-label="Пропущено">
                  <span
                    className={
                      student.missedCount ? styles.missed : styles.muted
                    }
                  >
                    {student.missedCount}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button type="button" onClick={() => setSelected(student)}>
                    Подробнее
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className={styles.backdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="attendance-modal-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <h3 id="attendance-modal-title">{selected.fullName}</h3>
                <p>
                  Посещаемость: {selected.percentage}% · пропущено: {selected.missedCount}
                </p>
              </div>
              <button
                type="button"
                className={styles.close}
                aria-label="Закрыть"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>

            {selected.lessons.length ? (
              <div className={styles.lessonList}>
                {selected.lessons.map((lesson) => (
                  <div className={styles.lesson} key={lesson.id}>
                    <div>
                      <strong>{formatDate(lesson.date)}</strong>
                      <span>{lesson.groupTitle}</span>
                    </div>
                    <span
                      className={
                        lesson.present ? styles.present : styles.absent
                      }
                    >
                      {lesson.present ? "Присутствовал" : "Отсутствовал"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noLessons}>Проведённых занятий пока нет.</p>
            )}
          </div>
        </div>
      )}
    </section>
    </>
  );
}

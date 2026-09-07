import { useEffect, useState } from "react";

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
  percentage: number;
  presentCount: number;
  totalLessons: number;
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
              <th aria-label="Действия" />
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td data-label="Ученик">{student.fullName}</td>
                <td data-label="Посещаемость">
                  <span className={styles.percentage}>
                    {student.percentage}%
                  </span>
                  <span className={styles.count}>
                    {student.presentCount} из {student.totalLessons}
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
                <p>Посещаемость: {selected.percentage}%</p>
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
  );
}

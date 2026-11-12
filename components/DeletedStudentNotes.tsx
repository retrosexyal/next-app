import { useEffect, useState } from "react";
import styles from "@/pages/admin/group.module.scss";

interface DeletedNote {
  uuid: string;
  text: string;
  createdAt?: string;
  deletedAt: string;
  deletedBy?: string;
}

export default function DeletedStudentNotes({ groupId, student, onClose }: {
  groupId: string;
  student: { _id: string; fullName: string };
  onClose: () => void;
}) {
  const [notes, setNotes] = useState<DeletedNote[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setNotes(null);
    setError("");
    fetch(`/api/admin/groups/deleted-notes?${new URLSearchParams({ groupId, studentId: student._id })}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    }).then(async (res) => {
      if (!res.ok) throw new Error("Не удалось загрузить историю");
      return res.json();
    }).then((data) => { if (!controller.signal.aborted) setNotes(data); })
      .catch(() => { if (!controller.signal.aborted) setError("Не удалось загрузить историю"); });
    return () => controller.abort();
  }, [groupId, student._id, attempt]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onClose]);
  const date = (value: string) => new Date(value).toLocaleString("ru-RU");
  return <div className={styles.modal} onClick={onClose}>
    <div className={styles.modalBox} role="dialog" aria-modal="true" aria-labelledby="deleted-notes-title"
      onClick={(e) => e.stopPropagation()} style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <h3 id="deleted-notes-title">Удалённые пометки — {student.fullName}</h3>
      {error ? <p role="alert">{error} <button type="button" onClick={() => setAttempt((n) => n + 1)}>Повторить</button></p>
        : notes === null ? <p role="status">Загрузка истории...</p>
        : notes.length === 0 ? <p>Удалённых пометок нет.</p>
        : notes.map((note) => <div key={note.uuid} style={{ borderBottom: "1px solid #ddd", padding: "12px 0" }}>
          <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{note.text}</p>
          {note.createdAt && <div>Создана: {date(note.createdAt)}</div>}
          <div>Удалена: {date(note.deletedAt)}</div>
          <div>Кто удалил: {note.deletedBy || "Не указан"}</div>
        </div>)}
      <button type="button" autoFocus onClick={onClose}>Закрыть</button>
    </div>
  </div>;
}

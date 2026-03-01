"use client";

import { useEffect, useState } from "react";
import styles from "./AdminNotebookButton.module.scss";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/Toast";
import { toastFetch } from "@/utils/toastFetch";

interface Note {
  uuid: string;
  text: string;
  createdAt: string;
}

export default function AdminNotebookButton() {
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editing, setEditing] = useState<Note | null>(null);
  const [text, setText] = useState("");

  const load = async () => {
    const data = await toastFetch<Note[]>(
      toast,
      "/api/admin/notebook",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        silent: true,
      },
    );
    setNotes(data || []);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await toastFetch(toast, "/api/admin/notebook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        action: editing ? "edit" : "add",
        uuid: editing?.uuid,
        text,
      }),
      successMessage: editing ? "Обновлено" : "Добавлено",
    });

    setText("");
    setEditing(null);
    load();
  };

  const remove = async (uuid: string) => {
    await toastFetch(toast, "/api/admin/notebook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        action: "delete",
        uuid,
      }),
      successMessage: "Удалено",
    });

    load();
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button className={styles.fab} onClick={() => setOpen(true)}>
        +
      </button>

      {/* MODAL */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Блокнот администратора</h3>

            <form onSubmit={submit} className={styles.form}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите заметку..."
              />

              <div className={styles.actions}>
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setText("");
                    }}
                    className={styles.cancel}
                  >
                    Отмена
                  </button>
                )}
                <button type="submit">
                  {editing ? "Сохранить" : "Добавить"}
                </button>
              </div>
            </form>

            <div className={styles.list}>
              {notes.map((n) => (
                <div key={n.uuid} className={styles.note}>
                  <div className={styles.noteText}>{n.text}</div>

                  <div className={styles.noteBtns}>
                    <button
                      onClick={() => {
                        setEditing(n);
                        setText(n.text);
                      }}
                    >
                      ✏
                    </button>

                    <button onClick={() => remove(n.uuid)}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={styles.close}
              onClick={() => setOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <Toast
        visible={toast.toast.visible}
        message={toast.toast.message}
        type={toast.toast.type}
      />
    </>
  );
}
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../group.module.scss";
import ContractService from "@/clientServices/ContractService";
import Head from "next/head";
import { MonthReportTable } from "@/components/MonthReportTable";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { toastFetch } from "@/utils/toastFetch";
import AdminNotebookButton from "@/components/AdminNotebookButton";

interface Student {
  _id: string;
  fullName: string;
  isTemp: boolean;
  messages?: { uuid: string; text: string }[];
  lastPayment?: {
    amount: number;
    date: string;
    type: "single" | "subscription";
  };
}

interface Teacher {
  _id: string;
  email: string;
}

export default function EditGroup() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const [payModal, setPayModal] = useState<{
    studentId: string;
    lessonId: string;
  } | null>(null);

  const [mode, setMode] = useState<"students" | "journal" | "month">("journal");
  const [expressQuery, setExpressQuery] = useState("");

  const [group, setGroup] = useState<any>(null);
  const [groupTitle, setGroupTitle] = useState("");
  const [teacherEmails, setTeacherEmails] = useState<string[]>(["admin@admin"]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contracts, setContracts] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [expressPays, setExpressPays] = useState<any | null>(null);

  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonId, setLessonId] = useState<string>("");
  const [lessonDate, setLessonDate] = useState<string>("");
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);

  const [rows, setRows] = useState<any[]>([]);
  const [payHistory, setPayHistory] = useState<any[] | null>(null);
  const [editSubStudent, setEditSubStudent] = useState<any | null>(null);
  const [noteStudent, setNoteStudent] = useState<Student | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [subAddCount, setSubAddCount] = useState<string>("8");
  const [subRemaining, setSubRemaining] = useState<string>("");
  const [subReason, setSubReason] = useState<string>("");

  const load = async () => {
    if (!id) return;
    const res = await fetch(`/api/groups/get-group?id=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const nextGroup = await res.json();
    setGroup(nextGroup);
    setGroupTitle(nextGroup.title || "");
  };

  const loadContracts = async () => {
    const res = await ContractService.getAllContract();
    setContracts(res.data || []);
  };

  useEffect(() => {
    loadContracts();
    fetch("/api/admin/teachers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((teachers: Teacher[]) => {
        if (Array.isArray(teachers)) {
          setTeacherEmails([
            "admin@admin",
            ...teachers.map((teacher) => teacher.email),
          ]);
        }
      });
  }, []);

  useEffect(() => {
    if (id) load();
  }, [id]);

  useEffect(() => {
    const now = new Date();
    const localDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60 * 1000,
    );
    setLessonDate(localDate.toISOString().slice(0, 10));
  }, []);

  // --- журнал ---
  const loadLessons = async (preferredLessonId?: string) => {
    if (!id) return;

    const response = await fetch(`/api/admin/groups/lessons?groupId=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const nextLessons = await response.json();
    setLessons(nextLessons);

    if (preferredLessonId) {
      setLessonId(preferredLessonId);
    } else if (nextLessons[0]) {
      setLessonId(nextLessons[0]._id);
    } else {
      setLessonId("");
      setRows([]);
    }
  };

  useEffect(() => {
    if (mode !== "journal" || !id) return;
    loadLessons();
  }, [mode, id]);

  const openPayModal = async (studentId: string, lessonId: string) => {
    setPayModal({
      studentId,
      lessonId,
    });
  };

  const loadLessonRows = async (selectedLessonId: string) => {
    const response = await fetch(
      `/api/admin/groups/lesson-view?lessonId=${selectedLessonId}`,
      {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    const data = await response.json();
    setRows(data.rows);
  };

  useEffect(() => {
    if (!lessonId || mode !== "journal") return;
    loadLessonRows(lessonId);
  }, [lessonId, mode]);

  const filtered = contracts.filter((c) =>
    `${c.childrenName} ${c.phone}`.toLowerCase().includes(query.toLowerCase()),
  );

  if (!group) return <div className={styles.container}>Загрузка...</div>;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className={styles.back}
            onClick={() => router.push("/admin/groups")}
          >
            ← Назад к группам
          </button>

          <button
            className={styles.back}
            onClick={async () => {
              const r = await fetch("/api/admin/payments/express-last-month", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              setExpressPays(await r.json());
            }}
          >
            💳 Express (30 дней)
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={mode === "students" ? styles.activeTab : ""}
            onClick={() => setMode("students")}
          >
            Состав
          </button>
          <button
            className={mode === "journal" ? styles.activeTab : ""}
            onClick={() => setMode("journal")}
          >
            Журнал
          </button>
          <button
            className={mode === "month" ? styles.activeTab : ""}
            onClick={() => setMode("month")}
          >
            Месяц
          </button>
        </div>

        <h2>{group.title}</h2>
        <div className={styles.groupSettings}>
          <input
            className={styles.ownerInput}
            value={groupTitle}
            maxLength={100}
            onChange={(e) => setGroupTitle(e.target.value)}
            placeholder="Название группы"
          />
          <button
            className={styles.saveOwner}
            onClick={async () => {
              try {
                const updatedGroup = await toastFetch<any>(
                  toast,
                  "/api/admin/groups/rename",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ groupId: id, title: groupTitle }),
                    successMessage: "Группа переименована",
                  },
                );
                setGroup(updatedGroup);
                setGroupTitle(updatedGroup.title);
              } catch {}
            }}
          >
            Переименовать группу
          </button>

          <select
            className={styles.ownerInput}
            value={group.ownerEmail}
            onChange={(e) => setGroup({ ...group, ownerEmail: e.target.value })}
          >
            {!teacherEmails.includes(group.ownerEmail) && (
              <option value={group.ownerEmail} disabled>
                {group.ownerEmail} — удалён из списка
              </option>
            )}
            {teacherEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>

          <button
            className={styles.saveOwner}
            onClick={async () => {
              try {
                const updatedGroup = await toastFetch<any>(
                  toast,
                  "/api/admin/groups/change-owner",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      groupId: id,
                      ownerEmail: group.ownerEmail,
                    }),
                    successMessage: "Преподаватель обновлён",
                  },
                );
                setGroup((current: any) => ({
                  ...current,
                  ownerEmail: updatedGroup.ownerEmail,
                }));
              } catch {}
            }}
          >
            Сменить преподавателя
          </button>
        </div>

        {/* ---------- СОСТАВ (без изменений) ---------- */}
        {mode === "students" && (
          <>
            <div className={styles.card}>
              <input
                placeholder="Поиск по имени или телефону"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className={styles.contractList}>
                {filtered.map((c) => (
                  <div
                    key={c._id}
                    className={styles.contractItem}
                    onClick={async () => {
                      await fetch("/api/groups/add-from-contract", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                          groupId: id,
                          contractId: c._id,
                        }),
                      });
                      load();
                    }}
                  >
                    <b>{c.childrenName}</b>
                    <span>{c.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <input
                placeholder="Имя ребёнка"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="Телефон родителя"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                onClick={async () => {
                  if (!name.trim()) return alert("Введите имя");
                  await fetch("/api/groups/add-student", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      groupId: id,
                      fullName: name.trim(),
                      phone: phone.trim(),
                    }),
                  });
                  setName("");
                  setPhone("");
                  load();
                }}
              >
                Добавить
              </button>
            </div>

            <ul className={styles.list}>
              {group.students?.map((s: Student) => (
                <li
                  key={s._id}
                  className={styles.item}
                  style={
                    (s as any).activeSubscription ? { color: "brown" } : {}
                  }
                >
                  <div>
                    <b>{s.fullName}</b>
                    {s.isTemp && (
                      <div className={styles.email}>без договора</div>
                    )}
                    {s.messages?.map(({ uuid, text }) => (
                      <div key={uuid} className={styles.studentNote}>{text}</div>
                    ))}
                  </div>

                  <button
                    className={styles.delete}
                    onClick={async () => {
                      if (!confirm("Удалить из группы?")) return;
                      await fetch("/api/groups/remove-student", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                          groupId: id,
                          studentId: s._id,
                        }),
                      });
                      load();
                    }}
                  >
                    ✕
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditSubStudent(s);
                      setSubRemaining("");
                      setSubReason("");
                    }}
                  >
                    ⚙️
                  </button>
                  <button
                    type="button"
                    title="Добавить заметку"
                    aria-label={`Добавить заметку для ${s.fullName}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setNoteText("");
                      setNoteStudent(s);
                    }}
                  >
                    📝
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ---------- ЖУРНАЛ (как teacher) ---------- */}
        {mode === "journal" && (
          <>
            <div className={styles.createLesson}>
              <label htmlFor="lesson-date">Дата занятия</label>
              <div className={styles.createLessonControls}>
                <input
                  id="lesson-date"
                  type="date"
                  value={lessonDate}
                  max={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setLessonDate(e.target.value)}
                />
                <button
                  type="button"
                  disabled={!lessonDate || isCreatingLesson}
                  onClick={async () => {
                    if (!lessonDate || !id) return;
                    setIsCreatingLesson(true);

                    try {
                      const result = await toastFetch<{
                        lesson: { _id: string };
                        created: boolean;
                      }>(toast, "/api/admin/groups/create-lesson", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ groupId: id, date: lessonDate }),
                        loadingMessage: "Создаём занятие...",
                        silent: true,
                      });

                      await loadLessons(result.lesson._id);
                      toast.success(
                        result.created
                          ? "Занятие создано — можно отмечать присутствие"
                          : "Занятие на эту дату уже было создано",
                      );
                    } catch {
                    } finally {
                      setIsCreatingLesson(false);
                    }
                  }}
                >
                  {isCreatingLesson ? "Создаём..." : "+ Создать занятие"}
                </button>
              </div>
            </div>

            <select
              className={styles.lessonSelect}
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
            >
              {!lessons.length && (
                <option value="" disabled>
                  Занятий пока нет
                </option>
              )}
              {lessons.map((l) => (
                <option key={l._id} value={l._id}>
                  {new Date(l.date).toLocaleDateString()}
                </option>
              ))}
            </select>

            <ul className={styles.list}>
              {rows.map((r) => {
                const paymentDate = r.payment?.date
                  ? new Date(r.payment.date)
                  : null;

                return (
                  <li
                    key={r._id}
                    className={`${styles.item} ${
                      r.present ? styles.present : ""
                    }`}
                    onClick={() => openPayModal(r._id, lessonId)}
                  >
                    <div className={styles.left}>
                      <div className={styles.name}>{r.student?.fullName}</div>
                      {r.subscriptionCompensation && (
                        <div style={{ marginTop: 4, fontSize: 12 }}>
                          Компенсация пропуска — без списания
                        </div>
                      )}

                      {r.payment && r.payment.type !== "free" && (
                        <div className={styles.lastPay}>
                          ₽ {r.payment.amount} —{" "}
                          {paymentDate?.toLocaleDateString()}
                        </div>
                      )}
                      {r.student.message && <span>{r.student.message}</span>}
                      {r.student.messages?.map(
                        ({ uuid, text }: { uuid: string; text: string }) => (
                          <span key={uuid} className={styles.studentNote}>{text}</span>
                        ),
                      )}
                      {r.student?.lastPayment?.amount && (
                        <span>
                          <div className={`${styles.lastPayErip}`}>
                            оплата:
                            {r.student?.lastPayment?.amount} —
                            {r.student?.lastPayment?.date
                              ? new Date(
                                  r.student.lastPayment.date,
                                ).toLocaleDateString()
                              : ""}
                          </div>
                        </span>
                      )}
                      {r.student?.activeSubscription && (
                        <div style={{ marginTop: 4, fontSize: 12 }}>
                          Осталось:{" "}
                          {r.student?.activeSubscription?.remainingLessons} по
                          абонементу
                        </div>
                      )}
                    </div>

                    <button
                      className={styles.payBtn}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const h = await fetch(
                          `/api/payments/by-student?id=${r.student._id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                          },
                        );
                        setPayHistory(await h.json());
                      }}
                    >
                      ₽
                    </button>
                    <button
                      type="button"
                      title="Добавить заметку"
                      aria-label={`Добавить заметку для ${r.student.fullName}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteText("");
                        setNoteStudent(r.student);
                      }}
                    >
                      📝
                    </button>

                    {/* {r.consumed && !r.refunded && (
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <button
                          style={{ fontSize: 12 }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await fetch("/api/attendance/refund", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                              body: JSON.stringify({
                                attendanceId: r._id,
                                reason: "medical",
                              }),
                            });
                            // перезагружаем журнал
                            const refreshed = await fetch(
                              `/api/admin/groups/lesson-view?lessonId=${lessonId}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              },
                            );
                            setRows((await refreshed.json()).rows);
                          }}
                        >
                          🩺 Справка
                        </button>

                        <button
                          style={{ fontSize: 12 }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await fetch("/api/attendance/refund", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                              body: JSON.stringify({
                                attendanceId: r._id,
                                reason: "free",
                              }),
                            });
                            const refreshed = await fetch(
                              `/api/admin/groups/lesson-view?lessonId=${lessonId}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              },
                            );
                            setRows((await refreshed.json()).rows);
                          }}
                        >
                          🆓 Пропуск
                        </button>
                      </div>
                    )} */}
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {mode === "month" && <MonthReportTable groupId={id as string} />}

        {/* ---------- МОДАЛКА ---------- */}
        {noteStudent && (
          <div
            className={styles.modal}
            onClick={() => { if (!isSavingNote) setNoteStudent(null); }}
          >
            <div
              className={styles.modalBox}
              role="dialog"
              aria-modal="true"
              aria-labelledby="student-note-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="student-note-title">Заметка — {noteStudent.fullName}</h3>
              <form
                className={styles.noteForm}
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!noteText.trim() || isSavingNote) return;
                  setIsSavingNote(true);
                  try {
                    const messages = await toastFetch<{ uuid: string; text: string }[]>(
                      toast,
                      "/api/groups/mark-for-student",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                          action: "add",
                          groupId: id,
                          studentId: noteStudent._id,
                          text: noteText.trim(),
                        }),
                        successMessage: "Заметка сохранена",
                      },
                    );
                    setGroup((current: any) => ({
                      ...current,
                      students: current.students.map((student: Student) =>
                        student._id === noteStudent._id ? { ...student, messages } : student,
                      ),
                    }));
                    setRows((current) => current.map((row) =>
                      row.student._id === noteStudent._id
                        ? { ...row, student: { ...row.student, messages } }
                        : row,
                    ));
                    setNoteStudent(null);
                    setNoteText("");
                  } catch {
                    // toastFetch shows the error; keep the draft for another attempt.
                  } finally {
                    setIsSavingNote(false);
                  }
                }}
              >
                <label htmlFor="student-note-text">Текст заметки</label>
                <textarea
                  id="student-note-text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Введите заметку..."
                  rows={4}
                  autoFocus
                  required
                  disabled={isSavingNote}
                />
                <div className={styles.noteButtons}>
                  <button type="button" disabled={isSavingNote} onClick={() => setNoteStudent(null)}>
                    Отмена
                  </button>
                  <button type="submit" disabled={isSavingNote || !noteText.trim()}>
                    {isSavingNote ? "Сохраняем..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {payHistory && (
          <div className={styles.modal} onClick={() => setPayHistory(null)}>
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>История оплат</h3>

              <div className={styles.modalList}>
                {payHistory.map((p) => (
                  <div key={p._id} className={styles.modalRow}>
                    {new Date(p.date).toLocaleDateString()} — {p.amount}₽ (
                    {p.type})
                  </div>
                ))}
              </div>

              <button onClick={() => setPayHistory(null)}>Закрыть</button>
            </div>
          </div>
        )}
        {expressPays && (
          <div className={styles.modal} onClick={() => setExpressPays(null)}>
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Express оплаты (30 дней) — {expressPays.count}</h3>

              <input
                placeholder="Поиск по телефону или фамилии"
                value={expressQuery}
                onChange={(e) => setExpressQuery(e.target.value)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  marginBottom: 8,
                }}
              />

              <div className={styles.modalList}>
                {expressPays.items
                  .filter((p: any) => {
                    if (!expressQuery) return true;
                    const q = expressQuery.toLowerCase();

                    const phone = (p.phone || "").toLowerCase();
                    const surname = (p.surname || "").toLowerCase();

                    return phone.includes(q) || surname.includes(q);
                  })
                  .map((p: any, idx: number) => (
                    <div key={p.paymentNo || idx} className={styles.modalRow}>
                      <div>
                        <b>
                          {p.surname} {p.firstName}
                        </b>
                      </div>
                      <div>
                        {p.phone} —{" "}
                        {p.date ? new Date(p.date).toLocaleDateString() : "—"} —{" "}
                        {p.amount ? `${p.amount}₽` : ""}
                      </div>
                    </div>
                  ))}
              </div>

              <button onClick={() => setExpressPays(null)}>Закрыть</button>
            </div>
          </div>
        )}
        {editSubStudent && (
          <div className={styles.modal} onClick={() => setEditSubStudent(null)}>
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Абонемент — {editSubStudent.fullName}</h3>

              {/* Текущие данные */}
              {editSubStudent.activeSubscription ? (
                (() => {
                  const sub = editSubStudent.activeSubscription;
                  const left = Math.max(
                    0,
                    (sub.totalLessons || 0) - (sub.usedLessons || 0),
                  );
                  return (
                    <div style={{ fontSize: 14, marginTop: 6 }}>
                      <div>
                        Всего: <b>{sub.totalLessons}</b>
                      </div>
                      <div>
                        Списано: <b>{sub.usedLessons}</b>
                      </div>
                      <div>
                        Осталось: <b>{left}</b>
                      </div>
                      {sub.autoMissCompensation && (
                        <div>
                          {sub.compensationLesson
                            ? "Компенсация одного пропуска использована"
                            : left === 0
                              ? "Ожидается проверка последнего пропуска при следующем уроке"
                              : "Доступна компенсация одного пропуска"}
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div style={{ fontSize: 14, marginTop: 6, opacity: 0.7 }}>
                  Абонемента нет (можно добавить занятия — будет
                  создан/обновлён)
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  placeholder="всего занятий или создать абонемент"
                  value={subAddCount}
                  onChange={(e) => setSubAddCount(e.target.value)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                  }}
                />
                <button
                  onClick={async () => {
                    const count = Number(subAddCount);
                    const subscriptionId =
                      editSubStudent.activeSubscription?._id;

                    await toastFetch(toast, "/api/subscriptions/add-lessons", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        subscriptionId,
                        count,
                        studentId: editSubStudent._id,
                      }),
                    });

                    await load();
                    setEditSubStudent(null);
                  }}
                  style={{
                    background: "#111",
                    color: "#fff",
                    borderRadius: 10,
                    border: "none",
                    padding: "10px 12px",
                  }}
                >
                  ➕ Добавить
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  placeholder="Сделать осталось = ..."
                  value={subRemaining}
                  onChange={(e) => setSubRemaining(e.target.value)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                  }}
                />
                <button
                  onClick={async () => {
                    const remaining = Number(subRemaining);
                    const subscriptionId =
                      editSubStudent.activeSubscription?._id;
                    if (!subscriptionId)
                      return alert(
                        "Нет subscriptionId. Нужно, чтобы сервер отдавал activeSubscription._id",
                      );

                    if (!subRemaining.trim()) return toast.error("Введите остаток занятий");
                    await toastFetch(toast, "/api/subscriptions/set-remaining", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        subscriptionId,
                        remaining,
                        reason: subReason,
                      }),
                    });

                    await load();
                    setEditSubStudent(null);
                  }}
                  style={{
                    background: "#111",
                    color: "#fff",
                    borderRadius: 10,
                    border: "none",
                    padding: "10px 12px",
                  }}
                >
                  ✏️ Применить
                </button>
              </div>

              <button onClick={() => setEditSubStudent(null)}>Закрыть</button>
            </div>
          </div>
        )}
      </div>
      {/* ---------- PAY MODAL ---------- */}

      {payModal && (
        <div className={styles.modal} onClick={() => setPayModal(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>Выберите оплату</h3>
            {(rows.find((row) => row.student?._id === payModal.studentId)?.student?.activeSubscription ||
              rows.find((row) => row.student?._id === payModal.studentId)?.consumed) && (
              <p>У ученика есть абонемент. Выбор другой оплаты заменит оплату урока, но не вернёт списанное занятие.</p>
            )}

            <button
              onClick={async () => {
                await toastFetch(toast, "/api/attendance/set-payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    lessonId: payModal.lessonId,
                    studentId: payModal.studentId,
                    mode: "single",
                  }),
                  successMessage: "Оплата сохранена",
                });
                await loadLessonRows(payModal.lessonId);
                setPayModal(null);
                load();
              }}
            >
              Разовое — 12₽
            </button>

            <button
              onClick={async () => {
                await toastFetch(toast, "/api/attendance/set-payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    lessonId: payModal.lessonId,
                    studentId: payModal.studentId,
                    mode: "subscription",
                  }),
                  successMessage: "Абонемент применён",
                });
                await loadLessonRows(payModal.lessonId);
                setPayModal(null);
                load();
              }}
            >
              Абонемент — 84₽
            </button>

            <button
              onClick={async () => {
                await toastFetch(toast, "/api/attendance/set-payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    lessonId: payModal.lessonId,
                    studentId: payModal.studentId,
                    mode: "relative",
                  }),
                  successMessage: "Оплата сохранена",
                });
                await loadLessonRows(payModal.lessonId);
                setPayModal(null);
                load();
              }}
            >
              Родственник — 9₽
            </button>

            <button
              style={{ marginTop: 12, color: "red" }}
              onClick={async () => {
                await toastFetch(toast, "/api/attendance/remove", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    lessonId: payModal.lessonId,
                    studentId: payModal.studentId,
                  }),
                  successMessage: "Присутствие отменено",
                });

                await loadLessonRows(payModal.lessonId);
                setPayModal(null);
                load();
              }}
            >
              Отменить присутствие
            </button>

            <button onClick={() => setPayModal(null)}>Отмена</button>
          </div>
        </div>
      )}
      <Toast
        visible={toast.toast.visible}
        message={toast.toast.message}
        type={toast.toast.type}
      />
      <AdminNotebookButton />
    </>
  );
}

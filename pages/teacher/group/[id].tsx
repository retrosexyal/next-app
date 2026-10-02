import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./group.module.scss";
import Head from "next/head";

import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/Toast";
import { toastFetch } from "@/utils/toastFetch";
import { MonthReportTable } from "@/components/MonthReportTable";

interface Student {
  _id: string;
  fullName: string;
  isTemp: boolean;
  phone: string;
  todayAttendance?: { subscriptionCompensation?: boolean } | null;
  activeSubscription?: {
    totalLessons: number;
    usedLessons: number;
  } | null;
  lastPayment?: {
    amount: number;
    date: string;
    type: "single" | "subscription";
  };
  message?: string;
  birthday?: string;
  messages?: { uuid: string; text: string }[];
}

export default function TeacherGroup() {
  const router = useRouter();
  const { id } = router.query;

  const toast = useToast();

  const [group, setGroup] = useState<any>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [online, setOnline] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [payHistory, setPayHistory] = useState<any[] | null>(null);
  const [payModal, setPayModal] = useState<{
    studentId: string;
    lessonId: string;
    date: string;
  } | null>(null);
  const [studentIdForMark, setStudentIdForMark] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<{
    uuid: string;
    text: string;
  } | null>(null);
  const [mode, setMode] = useState<"today" | "month">("today");

  const syncRunning = useRef(false);
  const pendingRef = useRef<any[]>([]);
  const queueKey = useRef("");
  const cachedLessonDate = useRef("");

  /* ---------- ONLINE / OFFLINE ---------- */

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* ---------- LOAD GROUP ---------- */

  const load = async () => {
    const data = await toastFetch<any>(
      toast,
      `/api/groups/get-group?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        loadingMessage: "Загружаем группу",
        silent: true,
      },
    );

    setGroup(data);

    const map: Record<string, boolean> = {};
    data.students.forEach((s: any) => {
      if (s.todayAttendance) {
        map[s._id] = s.todayAttendance.present;
      }
    });

    for (const action of pendingRef.current) {
      if (action.date === new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10)) {
        map[action.studentId] = action.mode !== "remove";
      }
    }
    setAttendance(map);
  };

  useEffect(() => {
    setLessonId(null);
    cachedLessonDate.current = "";
    if (id) load();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    try {
      const token = localStorage.getItem("token") || "";
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      if (!userId) return;
      queueKey.current = `attendance-queue:${userId}:${id}`;
      const saved = JSON.parse(localStorage.getItem(queueKey.current) || "[]");
      pendingRef.current = Array.isArray(saved) ? saved : [];
      setOfflineQueue([...pendingRef.current]);
    } catch { toast.error("Не удалось загрузить несинхронизированные отметки"); }
  }, [id]);

  const persistQueue = (next: any[]) => {
    if (!queueKey.current) throw new Error("Не удалось определить очередь текущего пользователя");
    localStorage.setItem(queueKey.current, JSON.stringify(next));
    pendingRef.current = next;
    setOfflineQueue([...next]);
  };

  const flushQueue = async () => {
    if (syncRunning.current || !navigator.onLine) return;
    syncRunning.current = true;
    try {
      while (pendingRef.current.length && navigator.onLine) {
        const action = pendingRef.current[0];
        const currentUserId = JSON.parse(atob((localStorage.getItem("token") || "").split(".")[1])).id;
        if (queueKey.current !== `attendance-queue:${currentUserId}:${id}`) {
          throw new Error("Сменился пользователь. Отметки сохранены для исходной учётной записи.");
        }
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` };
        let lid = action.lessonId;
        if (!lid) {
          const response = await fetch("/api/lessons/create", { method: "POST", headers, body: JSON.stringify({ groupId: id, date: action.date }) });
          if (!response.ok) throw new Error("Не удалось создать урок для синхронизации");
          lid = (await response.json())._id;
        }
        const response = await fetch(action.mode === "remove" ? "/api/attendance/remove" : "/api/attendance/set-payment", {
          method: "POST", headers, body: JSON.stringify({ lessonId: lid, studentId: action.studentId, mode: action.mode }),
        });
        if (!response.ok) throw new Error("Отметка не синхронизирована. Она сохранена на устройстве.");
        persistQueue(pendingRef.current.filter((entry) => entry.uuid !== action.uuid));
      }
      if (!pendingRef.current.length) await load();
    } catch (error: any) {
      toast.error(error.message || "Отметки сохранены на устройстве. Повторите синхронизацию.");
    } finally { syncRunning.current = false; }
  };

  const saveMark = async (mode: "single" | "subscription" | "relative" | "remove") => {
    if (!payModal) return;
    try {
      persistQueue([...pendingRef.current, { ...payModal, mode, uuid: crypto.randomUUID() }]);
      setAttendance((current) => ({ ...current, [payModal.studentId]: mode !== "remove" }));
      setPayModal(null);
      toast.success("Отметка сохранена на устройстве");
      await flushQueue();
    } catch { toast.error("Не удалось сохранить отметку на устройстве"); }
  };

  /* ---------- ENSURE LESSON ---------- */

  const ensureLesson = async () => {
    const today = new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10);
    if (lessonId && cachedLessonDate.current === today) return lessonId;

    const data = await toastFetch<any>(toast, "/api/lessons/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ groupId: id }),
      loadingMessage: "Создаём урок",
      silent: true,
    });

    setLessonId(data._id);
    cachedLessonDate.current = today;
    return data._id;
  };

  /* ---------- OFFLINE SYNC ---------- */

  useEffect(() => {
    if (online && offlineQueue.length) void flushQueue();
  }, [online, offlineQueue.length]);

  /* ---------- PAYMENTS SYNC ---------- */

  useEffect(() => {
    if (!id) return;

    const moscowNow = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const today = moscowNow.toISOString().slice(0, 10).replace(/-/g, "");

    const yesterday = new Date(moscowNow);
    yesterday.setDate(yesterday.getDate() - 14);
    const from = yesterday.toISOString().slice(0, 10).replace(/-/g, "");

    toastFetch(toast, "/api/payments/sync-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        groupId: id,
        from,
        to: today,
      }),
      silent: true,
    }).then(load);
  }, [id]);

  /* ---------- UI ---------- */

  const openPayModal = async (studentId: string) => {
    const date = new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10);
    const lid = navigator.onLine ? await ensureLesson() : (cachedLessonDate.current === date ? lessonId || "" : "");
    setPayModal({
      studentId,
      lessonId: lid,
      date,
    });
  };

  if (!group) return <div className={styles.container}>Загрузка...</div>;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        <button
          className={styles.back}
          onClick={() => router.push("/teacher/groups")}
        >
          ← Назад
        </button>
        <div className={styles.tabs}>
          <button
            className={mode === "today" ? styles.activeTab : ""}
            onClick={() => setMode("today")}
          >
            Сегодня
          </button>
          <button
            className={mode === "month" ? styles.activeTab : ""}
            onClick={() => setMode("month")}
          >
            Месяц
          </button>
        </div>

        <h2>{group.title}</h2>
        {mode === "today" ? (
          <>
            {!online && (
              <div className={styles.offline}>Офлайн — сохраняем локально</div>
            )}

            {offlineQueue.length > 0 && <div role="status">Ожидают синхронизации: {offlineQueue.length} <button onClick={() => flushQueue()} disabled={!online}>Повторить</button></div>}
            <ul className={styles.list}>
              {group.students.map((s: Student) => {
                const sub = s.activeSubscription;
                const left = sub ? sub.totalLessons - sub.usedLessons : 0;

                const last = s.lastPayment
                  ? new Date(s.lastPayment.date)
                  : null;
                const days = last
                  ? Math.floor((Date.now() - last.getTime()) / 86400000)
                  : null;

                let payClass = styles.payNone;
                if (days !== null) {
                  if (days <= 7) payClass = styles.payOk;
                  else if (days <= 14) payClass = styles.payWarn;
                  else payClass = styles.payBad;
                }

                return (
                  <li
                    key={s._id}
                    className={`${styles.item} ${
                      attendance[s._id] ? styles.present : ""
                    }`}
                    onClick={() => openPayModal(s._id)}
                  >
                    <div className={styles.left}>
                      <div className={styles.name}>
                        {s.fullName}
                        {s.isTemp && (
                          <span className={styles.temp}>без договора</span>
                        )}
                      </div>
                      {s.todayAttendance?.subscriptionCompensation && (
                        <div style={{ marginTop: 4, fontSize: 12 }}>
                          Компенсация пропуска — без списания
                        </div>
                      )}

                      {s.lastPayment && (
                        <div className={`${styles.lastPay} ${payClass}`}>
                          ₽ {s.lastPayment.amount} —{" "}
                          {last!.toLocaleDateString()}
                        </div>
                      )}

                      {s.birthday && (
                        <span className={styles.temp}>{s.birthday}</span>
                      )}
                      {/*                   {s.message && (
                    <span className={styles.temp}>{s.message}</span>
                  )} */}
                      {s.messages?.map(({ text, uuid }) => (
                        <div key={uuid} className={styles.messageRow}>
                          <span className={styles.temp}>{text}</span>

                          <div className={styles.messageActions}>
                            {/* ✏ EDIT */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setStudentIdForMark(s._id);
                                setEditingMessage({ uuid, text });
                              }}
                            >
                              ✏
                            </button>

                            {/* ❌ DELETE */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();

                                await toastFetch(
                                  toast,
                                  "/api/groups/mark-for-student",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    },
                                    body: JSON.stringify({
                                      action: "delete",
                                      studentId: s._id,
                                      messageUuid: uuid,
                                    }),
                                  },
                                );

                                load();
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {sub && (
                      <div
                        className={
                          left <= 1
                            ? styles.subDanger
                            : left <= 3
                              ? styles.subWarn
                              : styles.subOk
                        }
                        style={{ marginTop: 4, fontSize: 12 }}
                      >
                        Осталось: {left}
                      </div>
                    )}

                    <div className={styles.btnWrapper}>
                      <button
                        className={styles.payBtn}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const h = await toastFetch<any>(
                            toast,
                            `/api/payments/by-student?id=${s._id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token",
                                )}`,
                              },
                              loadingMessage: "Загружаем историю оплат",
                              silent: true,
                            },
                          );
                          setPayHistory(h);
                        }}
                      >
                        ₽
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStudentIdForMark(s._id);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <MonthReportTable groupId={id as string} isTeacher />
        )}

        {/* ---------- PAY MODAL ---------- */}

        {payModal && (
          <div className={styles.modal} onClick={() => setPayModal(null)}>
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Выберите оплату</h3>
              {(group.students.find((student: any) => student._id === payModal.studentId)?.activeSubscription ||
                group.students.find((student: any) => student._id === payModal.studentId)?.todayAttendance?.consumed) && (
                <p>У ученика есть абонемент. Выбор другой оплаты заменит оплату урока, но не вернёт списанное занятие.</p>
              )}

              <button
                onClick={() => saveMark("single")}
              >
                Разовое — 12₽
              </button>

              <button
                onClick={() => saveMark("subscription")}
              >
                Абонемент — 84₽
              </button>

              <button
                onClick={() => saveMark("relative")}
              >
                Родственник — 9₽
              </button>

              <button
                style={{ marginTop: 12, color: "red" }}
                onClick={() => saveMark("remove")}
              >
                Отменить присутствие
              </button>

              <button onClick={() => setPayModal(null)}>Отмена</button>
            </div>
          </div>
        )}

        {/* ---------- STUDENT MESSAGE ---------- */}

        {studentIdForMark && (
          <div
            className={styles.modal}
            onClick={() => {
              setStudentIdForMark(null);
              setEditingMessage(null);
            }}
          >
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>заметка</h3>

              <form
                className={styles.noteForm}
                onSubmit={async (e) => {
                  e.preventDefault();

                  const formData = new FormData(e.currentTarget);
                  const message = formData.get("message");

                  await toastFetch(toast, "/api/groups/mark-for-student", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      action: editingMessage ? "edit" : "add",
                      studentId: studentIdForMark,
                      text: message,
                      messageUuid: editingMessage?.uuid,
                    }),
                  });

                  setStudentIdForMark(null);
                  setEditingMessage(null);
                  load();
                }}
              >
                <input
                  name="message"
                  defaultValue={editingMessage?.text || ""}
                  className={styles.noteInput}
                  placeholder="Введите заметку..."
                />

                <div className={styles.noteButtons}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setStudentIdForMark(null);
                      setEditingMessage(null);
                    }}
                  >
                    Отмена
                  </button>

                  <button type="submit" className={styles.saveBtn}>
                    сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------- PAY HISTORY ---------- */}

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

        {/* ---------- ADD STUDENT ---------- */}

        {!showAdd ? (
          <button className={styles.add} onClick={() => setShowAdd(true)}>
            + Добавить ученика
          </button>
        ) : (
          <div className={styles.addForm}>
            <input
              placeholder="Имя ребёнка"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              placeholder="Телефон"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />

            <div className={styles.addActions}>
              <button
                onClick={async () => {
                  if (!newName) {
                    toast.error("Введите имя");
                    return;
                  }

                  await toastFetch(toast, "/api/groups/add-student", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      groupId: id,
                      fullName: newName,
                      phone: newPhone,
                    }),
                    successMessage: "Ученик добавлен",
                  });

                  setNewName("");
                  setNewPhone("");
                  setShowAdd(false);
                  load();
                }}
              >
                ✔
              </button>

              <button onClick={() => setShowAdd(false)}>✕</button>
            </div>
          </div>
        )}
      </div>

      <Toast
        visible={toast.toast.visible}
        message={toast.toast.message}
        type={toast.toast.type}
      />
    </>
  );
}

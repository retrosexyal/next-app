import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./group.module.scss";
import Head from "next/head";

import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/Toast";
import { toastFetch } from "@/utils/toastFetch";

interface Student {
  _id: string;
  fullName: string;
  isTemp: boolean;
  phone: string;
  activeSubscription?: {
    totalLessons: number;
    usedLessons: number;
  } | null;
  lastPayment?: {
    amount: number;
    date: string;
    type: "single" | "subscription";
  };
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
  } | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

    setAttendance(map);
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  /* ---------- ENSURE LESSON ---------- */

  const ensureLesson = async () => {
    if (lessonId) return lessonId;

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
    return data._id;
  };

  /* ---------- OFFLINE SYNC ---------- */

  useEffect(() => {
    if (online && offlineQueue.length) {
      offlineQueue.forEach((p) =>
        toastFetch(toast, "/api/attendance/set", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(p),
          silent: true,
        }),
      );
      setOfflineQueue([]);
    }
  }, [online]);

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
    const lid = await ensureLesson();
    setPayModal({
      studentId,
      lessonId: lid,
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

        <h2>{group.title}</h2>

        {!online && (
          <div className={styles.offline}>Офлайн — сохраняем локально</div>
        )}

        <ul className={styles.list}>
          {group.students.map((s: Student) => {
            const sub = s.activeSubscription;
            const left = sub ? sub.totalLessons - sub.usedLessons : 0;

            const last = s.lastPayment ? new Date(s.lastPayment.date) : null;
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

                  {s.lastPayment && (
                    <div className={`${styles.lastPay} ${payClass}`}>
                      ₽ {s.lastPayment.amount} — {last!.toLocaleDateString()}
                    </div>
                  )}
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
              </li>
            );
          })}
        </ul>

        {/* ---------- PAY MODAL ---------- */}

        {payModal && (
          <div className={styles.modal} onClick={() => setPayModal(null)}>
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Выберите оплату</h3>

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

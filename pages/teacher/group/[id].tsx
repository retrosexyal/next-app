import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./group.module.scss";
import Head from "next/head";

interface Student {
  _id: string;
  fullName: string;
  isTemp: boolean;
  phone: string;
  activeSubscription?: {
    totalLessons: number;
    usedLessons: number;
  } | null;
}

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
    date: string; // ISO
    type: "single" | "subscription";
  };
}

export default function TeacherGroup() {
  const router = useRouter();
  const { id } = router.query;

  const [group, setGroup] = useState<any>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [online, setOnline] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [payHistory, setPayHistory] = useState<any[] | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  const load = async () => {
    const res = await fetch(`/api/groups/get-group?id=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = await res.json();
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

  const ensureLesson = async () => {
    if (lessonId) return lessonId;

    const res = await fetch("/api/lessons/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ groupId: id }),
    });

    const data = await res.json();
    setLessonId(data._id);
    return data._id;
  };

  const sync = async (state: Record<string, boolean>) => {
    const items = Object.entries(state).map(([studentId, present]) => ({
      studentId,
      present,
    }));

    const payload = { lessonId: await ensureLesson(), items };

    if (!online) {
      setOfflineQueue((q) => [...q, payload]);
      return;
    }

    await fetch("/api/attendance/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
  };

  useEffect(() => {
    if (online && offlineQueue.length) {
      offlineQueue.forEach((p) =>
        fetch("/api/attendance/set", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(p),
        }),
      );
      setOfflineQueue([]);
    }
  }, [online]);

  const toggle = (sid: string) => {
    const next = { ...attendance, [sid]: !attendance[sid] };
    setAttendance(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => sync(next), 500);
  };

  useEffect(() => {
    if (!id) return;

    const moscowNow = new Date(Date.now() + 3 * 60 * 60 * 1000);

    // сегодня
    const today = moscowNow.toISOString().slice(0, 10).replace(/-/g, "");

    // вчера
    const yesterday = new Date(moscowNow);
    yesterday.setDate(yesterday.getDate() - 14);
    const todayMinus1 = yesterday.toISOString().slice(0, 10).replace(/-/g, "");

    fetch("/api/payments/sync-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        groupId: id,
        from: todayMinus1,
        to: today,
      }),
    }).then(load);
  }, [id]);

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
                className={`${styles.item} ${attendance[s._id] ? styles.present : ""}`}
                onClick={() => toggle(s._id)}
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
                {sub && (
                  <button
                    className={styles.plusBtn}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await fetch("/api/subscriptions/add", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ studentId: s._id }),
                      });
                      load();
                    }}
                  >
                    ➕
                  </button>
                )}

                <button
                  className={styles.payBtn}
                  onClick={async (e) => {
                    e.stopPropagation();
                    /* const res = await fetch("/api/payments/check-student", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`!,
                    },
                    body: JSON.stringify({
                      studentId: s._id,
                      phone: s.phone,
                      fullName: s.fullName,
                    }),
                  }); */

                    /* const data = await res.json(); */
                    /* await load();  */ // обновляем lastPayment
                    const h = await fetch(
                      `/api/payments/by-student?id=${s._id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      },
                    );
                    setPayHistory(await h.json());

                    /*  alert(
                    data.length
                      ? data
                          .map(
                            (p: any) =>
                              `${p.Created.slice(6, 8)}.${p.Created.slice(4, 6)} — ${p.Amount}р`,
                          )
                          .join("\n")
                      : "Оплат не найдено",
                  ); */
                  }}
                >
                  ₽
                </button>
              </li>
            );
          })}
        </ul>
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
                  if (!newName) return alert("Введите имя");

                  await fetch("/api/groups/add-student", {
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
    </>
  );
}

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../group.module.scss";
import ContractService from "@/clientServices/ContractService";
import Head from "next/head";
import { MonthReportTable } from "@/components/MonthReportTable";

interface Student {
  _id: string;
  fullName: string;
  isTemp: boolean;
  lastPayment?: {
    amount: number;
    date: string;
    type: "single" | "subscription";
  };
}

export default function EditGroup() {
  const router = useRouter();
  const { id } = router.query;

  const [mode, setMode] = useState<"students" | "journal" | "month">("journal");
  const [expressQuery, setExpressQuery] = useState("");

  const [group, setGroup] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contracts, setContracts] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [expressPays, setExpressPays] = useState<any | null>(null);

  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonId, setLessonId] = useState<string>("");

  const [rows, setRows] = useState<any[]>([]);
  const [payHistory, setPayHistory] = useState<any[] | null>(null);
  const [editSubStudent, setEditSubStudent] = useState<any | null>(null);
  const [subAddCount, setSubAddCount] = useState<string>("8");
  const [subRemaining, setSubRemaining] = useState<string>("");
  const [subReason, setSubReason] = useState<string>("");

  const load = async () => {
    if (!id) return;
    const res = await fetch(`/api/groups/get-group?id=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setGroup(await res.json());
  };

  const loadContracts = async () => {
    const res = await ContractService.getAllContract();
    setContracts(res.data || []);
  };

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    if (id) load();
  }, [id]);

  // --- журнал ---
  useEffect(() => {
    if (mode !== "journal" || !id) return;

    fetch(`/api/admin/groups/lessons?groupId=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setLessons(d);
        if (d[0]) setLessonId(d[0]._id);
      });
  }, [mode, id]);

  useEffect(() => {
    if (!lessonId || mode !== "journal") return;

    fetch(`/api/admin/groups/lesson-view?lessonId=${lessonId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => setRows(data.rows));
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
        <input
          className={styles.ownerInput}
          value={group.ownerEmail}
          onChange={(e) => setGroup({ ...group, ownerEmail: e.target.value })}
          placeholder="email преподавателя"
        />

        <button
          className={styles.saveOwner}
          onClick={async () => {
            await fetch("/api/admin/groups/change-owner", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                groupId: id,
                ownerEmail: group.ownerEmail,
              }),
            });
            alert("Преподаватель обновлён");
          }}
        >
          Сменить преподавателя
        </button>

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
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ---------- ЖУРНАЛ (как teacher) ---------- */}
        {mode === "journal" && (
          <>
            <select
              className={styles.lessonSelect}
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
            >
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
                  >
                    <div className={styles.left}>
                      <div className={styles.name}>{r.student?.fullName}</div>

                      {r.payment && r.payment.type !== "free" && (
                        <div className={styles.lastPay}>
                          ₽ {r.payment.amount} —{" "}
                          {paymentDate?.toLocaleDateString()}
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
                    {r.consumed && !r.refunded && (
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
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {mode === "month" && <MonthReportTable groupId={id as string} />}

        {/* ---------- МОДАЛКА ---------- */}
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
                    </div>
                  );
                })()
              ) : (
                <div style={{ fontSize: 14, marginTop: 6, opacity: 0.7 }}>
                  Абонемента нет (можно добавить занятия — будет
                  создан/обновлён)
                </div>
              )}

              {/* Причина обязательна */}
              <input
                placeholder="Причина (обязательно)"
                value={subReason}
                onChange={(e) => setSubReason(e.target.value)}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  marginTop: 12,
                }}
              />

              {/* Добавить занятия */}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  placeholder="+ занятий"
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
                    /* if (!Number.isFinite(count) || count === 0)
                      return alert("Введите число"); */
                    /*  if (!subReason.trim()) return alert("Укажите причину"); */

                    // если нет subscriptionId — нужен способ получить/создать.
                    // Я предполагаю, что editSubStudent.activeSubscription содержит _id.
                    const subscriptionId =
                      editSubStudent.activeSubscription?._id;
                    if (!subscriptionId)
                      return alert(
                        "Нет subscriptionId. Нужно, чтобы сервер отдавал activeSubscription._id",
                      );

                    await fetch("/api/subscriptions/add-lessons", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        subscriptionId,
                        count,
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
                  ➕ Добавить
                </button>
              </div>

              {/* Установить остаток */}
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

                    await fetch("/api/subscriptions/set-remaining", {
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
    </>
  );
}

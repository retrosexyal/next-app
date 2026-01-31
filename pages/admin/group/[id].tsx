import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../group.module.scss";
import ContractService from "@/clientServices/ContractService";
import Head from "next/head";

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

  const [mode, setMode] = useState<"students" | "journal">("journal");

  const [group, setGroup] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contracts, setContracts] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonId, setLessonId] = useState<string>("");

  const [rows, setRows] = useState<any[]>([]);
  const [payHistory, setPayHistory] = useState<any[] | null>(null);

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
      .then(setRows);
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
        <button
          className={styles.back}
          onClick={() => router.push("/admin/groups")}
        >
          ← Назад к группам
        </button>

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
                {filtered.slice(0, 10).map((c) => (
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
                <li key={s._id} className={styles.item}>
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
                const last = r.student?.lastPayment
                  ? new Date(r.student.lastPayment.date)
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

                      {r.student?.lastPayment && (
                        <div className={styles.lastPay}>
                          ₽ {r.student.lastPayment.amount} —{" "}
                          {last!.toLocaleDateString()}
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
                  </li>
                );
              })}
            </ul>
          </>
        )}

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
      </div>
    </>
  );
}

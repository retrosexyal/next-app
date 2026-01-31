import { useEffect, useState } from "react";
import styles from "./group.module.scss";
import { useAppSelector } from "@/store";
import { useCheckAdmin } from "@/hooks/useCheckAdmin";
import Head from "next/head";

interface Group {
  _id: string;
  title: string;
  ownerEmail: string;
}

export default function AdminGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [title, setTitle] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const { email } = useAppSelector((state) => state.user.user);

  const load = async () => {
    const res = await fetch("/api/admin/groups/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setGroups(data);
  };

  useEffect(() => {
    load();
  }, [email]);

  const create = async () => {
    if (!title || !ownerEmail) return alert("Заполни всё");

    await fetch("/api/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, ownerEmail }),
    });

    setTitle("");
    setOwnerEmail("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить группу?")) return;

    await fetch("/api/admin/groups/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id }),
    });

    load();
  };

  const isAdmin = useCheckAdmin();

  if (!isAdmin) {
    return <div>необходимо перелогиниться, ИЛИ НЕТ ДОСТУПА</div>;
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        <h2>Группы</h2>

        <ul className={styles.list}>
          {groups.map((g) => (
            <li
              key={g._id}
              className={styles.item}
              onClick={() => (window.location.href = `/admin/group/${g._id}`)}
            >
              <div>
                <b>{g.title}</b>
                <div className={styles.email}>{g.ownerEmail}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/admin/group/${g._id}?tab=journal`;
                }}
              >
                📋
              </button>

              <button
                className={styles.delete}
                onClick={(e) => {
                  e.stopPropagation();
                  remove(g._id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.card}>
          <input
            placeholder="Название группы"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Email преподавателя"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />
          <button onClick={create}>Создать</button>
        </div>
      </div>
    </>
  );
}

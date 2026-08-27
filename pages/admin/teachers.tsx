import Head from "next/head";
import { FormEvent, useCallback, useEffect, useState } from "react";

import AdminNotebookButton from "@/components/AdminNotebookButton";
import { useCheckAdmin } from "@/hooks/useCheckAdmin";
import styles from "./group.module.scss";

type Teacher = {
  _id: string;
  email: string;
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function AdminTeachers() {
  const isAdmin = useCheckAdmin();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/teachers", { headers: authHeaders() });
    if (response.ok) setTeachers(await response.json());
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const add = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Не удалось добавить");
      setEmail("");
      setPassword("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось добавить");
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (teacherEmail: string) => {
    if (!confirm(`Удалить преподавателя и пользователя ${teacherEmail}?`)) return;
    setError("");
    const response = await fetch("/api/admin/teachers", {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ email: teacherEmail }),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.message || "Не удалось удалить");
    await load();
  };

  if (!isAdmin) return <div>необходимо перелогиниться, ИЛИ НЕТ ДОСТУПА</div>;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={styles.container}>
        <h2>Преподаватели</h2>
        <ul className={styles.list}>
          <li className={styles.item}>
            <div>
              <b>admin@admin</b>
              <div className={styles.email}>встроенный администратор</div>
            </div>
          </li>
          {teachers.map((teacher) => (
            <li className={styles.item} key={teacher._id}>
              <b>{teacher.email}</b>
              <button className={styles.delete} onClick={() => remove(teacher.email)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
        <form className={styles.card} onSubmit={add}>
          <input
            type="email"
            placeholder="Email преподавателя"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль (минимум 6 символов)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Добавление..." : "Добавить преподавателя"}
          </button>
        </form>
      </div>
      <AdminNotebookButton />
    </>
  );
}

import { useEffect, useState } from "react";
import styles from "./teacherGroups.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";

interface Group {
  _id: string;
  title: string;
}

export default function TeacherGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/groups/my", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then(setGroups);
  }, []);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        <h2>Мои группы</h2>
        <ul className={styles.list}>
          {groups.map((g) => (
            <li
              key={g._id}
              className={styles.item}
              onClick={() => router.push(`/teacher/group/${g._id}`)}
            >
              {g.title}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

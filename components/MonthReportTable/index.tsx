import { useEffect, useState } from "react";
import styles from "./MonthReportTable.module.scss";

type Props = {
  groupId: string;
};

export function MonthReportTable({ groupId }: Props) {
  const [month, setMonth] = useState(
    () => new Date().toISOString().slice(0, 7),
  );
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    setLoading(true);
    fetch("/api/admin/groups/month-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ groupId, month }),
    })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [groupId, month]);

  if (loading) return <div>Загрузка…</div>;
  if (!data) return null;

  const {
    students,
    dates,
    matrix,
    totalsByDate,
    totalsByStudent,
  } = data;

  return (
    <div className={styles.wrapper}>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className={styles.monthInput}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ученик</th>
              {dates.map((d: string) => (
                <th key={d}>{new Date(d).getDate()}</th>
              ))}
              <th>Итого</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s: any) => (
              <tr key={s._id}>
                <td className={styles.student}>{s.fullName}</td>

                {dates.map((d: string) => {
                  const cell = matrix[s._id]?.[d];
                  if (!cell)
                    return <td key={d} className={styles.empty} />;

                  return (
                    <td
                      key={d}
                      className={
                        cell.present
                          ? styles.present
                          : styles.absent
                      }
                    >
                      {cell.amount > 0 ? cell.amount.toFixed(1) : ""}
                    </td>
                  );
                })}

                <td className={styles.total}>
                  {totalsByStudent[s._id]?.toFixed(1) || "0"}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td>Итого</td>
              {dates.map((d: string) => (
                <td key={d} className={styles.total}>
                  {totalsByDate[d]?.toFixed(1) || "0"}
                </td>
              ))}
              <td className={styles.total}>
                {Object.values(totalsByStudent)
                  .reduce((a: number, b: any) => a + b, 0)
                  .toFixed(1)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

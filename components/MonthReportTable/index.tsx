import { useEffect, useState } from "react";
import styles from "./MonthReportTable.module.scss";
import Calendar from "@/components/AttendanceTable/Calendar";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

type Props = {
  groupId: string;
  isTeacher?: boolean;
};

export function MonthReportTable({ groupId, isTeacher }: Props) {
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!groupId) return;
    let active = true;
    setLoading(true);
    setError("");
    setSelected(null);
    fetch(
      isTeacher ? "/api/groups/month-report" : "/api/admin/groups/month-report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ groupId, month }),
      },
    )
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(value => { if (active) setData(value); })
      .catch(() => { if (active) setError("Не удалось загрузить отчёт"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [groupId, month, isTeacher]);

  if (loading) return <div>Загрузка…</div>;
  if (error) return <p role="alert">{error}</p>;
  if (!data) return null;

  const { students, dates, matrix, totalsByDate, totalsByStudent } = data;

  return (
    <div className={styles.wrapper}>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className={styles.monthInput}
      />
      <p className={styles.periodNote}>% — с 1 сентября до сегодня в этой группе. Ниже 40% выделено красным. Нажмите на имя, чтобы открыть календарь.</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.studentColumn}>
                <span className={styles.studentText}>Ученик</span>
              </th>
              {dates?.map((d: string) => (
                <th key={d}>{new Date(d).getDate()}</th>
              ))}
              <th>Итого</th>
            </tr>
          </thead>

          <tbody>
            {students?.map((s: any) => (
              <tr key={s._id}>
                <td className={`${styles.student} ${styles.studentColumn}`}>
                  <button className={`${styles.studentButton} ${data.attendanceOverview?.[s._id]?.lowAttendance ? styles.lowAttendance : ""}`} title={s.fullName} onClick={() => setSelected(s)}>
                    <span className={styles.studentText}>{s.fullName}</span>
                    <strong className={styles.attendancePercent}>{data.attendanceOverview?.[s._id]?.percentage == null ? "—" : `${data.attendanceOverview[s._id].percentage}%`}</strong>
                  </button>
                </td>

                {dates?.map((d: string) => {
                  const cell = matrix[s._id]?.[d];
                  if (!cell) return <td key={d} className={styles.empty} />;

                  return (
                    <td
                      key={d}
                      className={cell.present ? styles.present : styles.absent}
                    >
                      {isTeacher
                        ? cell
                          ? "✓"
                          : ""
                        : cell.amount > 0
                          ? cell.amount.toFixed(1)
                          : ""}
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
              <td className={styles.studentColumn}>
                <span className={styles.studentText}>Итого</span>
              </td>
              {dates?.map((d: string) => (
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
      {selected && <Dialog open onClose={() => setSelected(null)} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle><div className={styles.calendarHeading}><span>{selected.fullName}</span><Button onClick={() => setSelected(null)}>Закрыть</Button></div></DialogTitle>
        <DialogContent><Calendar lessons={data.attendanceOverview?.[selected._id]?.lessons || []} /></DialogContent>
      </Dialog>}
    </div>
  );
}

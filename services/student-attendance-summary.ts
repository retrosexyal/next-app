// Уроки хранятся как календарные даты UTC. Отсутствие отметки на уроке — пропуск.
export function studentAttendanceSummary(student: any, groups: any[], lessons: any[], records: Map<string, any>, from: string, today: string) {
  const current = groups.filter(g => g.students.some((id: any) => String(id) === String(student._id)));
  const starts = new Map<string, string>();
  for (const group of current) {
    starts.set(String(group._id), "0000-01-01");
  }
  // Для учеников без текущей группы сохраняем расчёт по историческим группам.
  if (!current.length) for (const lesson of lessons) {
    if (!records.has(String(lesson._id))) continue;
    const group = String(lesson.group);
    starts.set(group, "0000-01-01");
  }
  const eligible = lessons.filter(lesson => {
    const date = new Date(lesson.date).toISOString().slice(0, 10);
    const joined = starts.get(String(lesson.group));
    return (!from || date >= from) && date <= today && (records.has(String(lesson._id)) || (joined !== undefined && date >= joined));
  });
  const attended = eligible.filter(l => { const mark = records.get(String(l._id)); return mark?.present && !mark.refunded; });
  return { eligible, attended };
}

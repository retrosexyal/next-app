// Проверки выполняются только на моделях в памяти; подключений к БД нет.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const students = new Map();
const subscriptions = new Map();
const attendances = new Map();
const lessons = new Map();
let nextId = 0;
const query = (value) => ({ session: async () => value });
const doc = (value) => Object.assign(value, { save: async () => value });
const Student = { findById: (id) => query(students.get(id)) };
Student.find = () => ({ select: () => query([...students.values()]) });
Student.updateOne = async (filter, update) => {
  const student = students.get(filter._id);
  if (student && (!filter.activeSubscription || student.activeSubscription === filter.activeSubscription)) {
    Object.assign(student, update.$set);
  }
};
const Subscription = {
  findOne: (filter) => query([...subscriptions.values()].find((sub) => sub._id === filter._id && sub.student === filter.student)),
  create: async ([value]) => {
    const sub = doc({ ...value, _id: "sub-" + (++nextId) });
    subscriptions.set(sub._id, sub);
    return [sub];
  },
};
const Attendance = {
  findOne: ({ lesson, student }) => query(attendances.get(lesson + ":" + student)),
  create: async ([value]) => {
    const row = doc({ consumed: false, ...value });
    attendances.set(value.lesson + ":" + value.student, row);
    return [row];
  },
};
Subscription.findOneAndUpdate = async (filter) => {
  const sub = subscriptions.get(filter._id);
  if (!sub || sub.student !== filter.student || sub.usedLessons >= sub.totalLessons) return null;
  sub.usedLessons += 1;
  return sub;
};
const Lesson = {
  findOne: ({ group, date }) => query([...lessons.values()].find((lesson) => lesson.group === group && lesson.date.getTime() === date.getTime())),
  create: async ([value]) => {
    const lesson = { ...value, _id: "lesson-" + (++nextId) };
    lessons.set(lesson._id, lesson);
    return [lesson];
  },
};
const mocks = {
  mongoose: { startSession: async () => ({ withTransaction: async (callback) => callback(), endSession: async () => {} }) },
  "@/models/attendance-model": Attendance,
  "@/models/subscription-model": Subscription,
  "@/models/group-student-model": Student,
  "@/models/lesson-model": Lesson,
};
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync("services/attendance-service.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, { exports: exportsObject, require: (name) => {
  if (!(name in mocks)) throw new Error("Unexpected dependency: " + name);
  return mocks[name];
} });

(async () => {
  const save = exportsObject.saveAttendancePayment;
  const lesson = { _id: "today", date: new Date() };
  students.set("child", doc({ _id: "child", activeSubscription: null }));
  await save(lesson, "child", "subscription");
  const subId = students.get("child").activeSubscription;
  const sub = subscriptions.get(subId);
  assert.equal(sub.usedLessons, 1, "Первый абонемент: остаток 7");
  await save(lesson, "child", "subscription");
  assert.equal(sub.usedLessons, 1, "Повторный запрос не списывает");
  await save(lesson, "child", "relative");
  assert.equal(attendances.get("today:child").payment.amount, 9);
  assert.equal(sub.usedLessons, 1, "Смена оплаты сохраняет списание");
  attendances.get("today:child").present = false;
  await save(lesson, "child", "subscription");
  assert.equal(sub.usedLessons, 1, "Повторная отметка после отмены не списывает");
  sub.usedLessons = 7;
  await save({ _id: "last", date: new Date() }, "child", "subscription");
  assert.equal(students.get("child").activeSubscription, null, "Последнее занятие завершает абонемент");
  await save({ _id: "last", date: new Date() }, "child", "subscription");
  assert.equal(subscriptions.size, 1, "Повтор последнего занятия не создаёт новый");
  await save({ _id: "next", date: new Date() }, "child", "subscription");
  assert.equal(subscriptions.size, 2, "Следующий абонемент создаётся явно");
  // Старые записи без chargedSubscription сохраняют защиту consumed.
  attendances.set("legacy:child", doc({ consumed: true, source: "subscription", payment: { paymentId: subId }, present: true }));
  await save({ _id: "legacy", date: new Date() }, "child", "single");
  assert.equal(attendances.get("legacy:child").chargedSubscription, subId);
  const lessonExports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync("services/lesson-service.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText, { exports: lessonExports, require: (name) => {
    if (!(name in mocks)) throw new Error("Unexpected dependency: " + name);
    return mocks[name];
  } });
  const active = subscriptions.get(students.get("child").activeSubscription);
  const before = active.usedLessons;
  const today = lessonExports.studioToday();
  const created = await lessonExports.createGroupLesson({ _id: "group", students: ["child"] }, today);
  assert.equal(active.usedLessons, before + 1, "Создание сегодняшнего урока списывает");
  assert.equal(attendances.get(created.lesson._id + ":child").present, false, "Списание не означает присутствие");
  await lessonExports.createGroupLesson({ _id: "group", students: ["child"] }, today);
  assert.equal(active.usedLessons, before + 1, "Повтор создания не списывает");
  await save(created.lesson, "child", "subscription");
  assert.equal(active.usedLessons, before + 1, "Присутствие после автоматического списания не списывает");
  await lessonExports.createGroupLesson({ _id: "group", students: ["child"] }, new Date(today.getTime() - 86400000));
  assert.equal(active.usedLessons, before + 1, "Вчерашний урок автоматически не списывает");
  console.log("OK: политика списания, смена оплаты, повторы, последний урок и задние даты (без БД)");
})().catch((error) => { console.error(error); process.exitCode = 1; });

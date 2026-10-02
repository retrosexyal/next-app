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
  findOne: ({ lesson, student, chargedSubscription, consumed }) => {
    const row = attendances.get(lesson + ":" + student);
    return query(row && (!chargedSubscription || row.chargedSubscription === chargedSubscription) &&
      (consumed === undefined || row.consumed === consumed) ? row : null);
  },
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
  findById: (id) => query(lessons.get(id)),
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
const policyExports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync("services/subscription-policy.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, { exports: policyExports, require: (name) => mocks[name] });
mocks["@/services/subscription-policy"] = policyExports;
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
  assert.equal(sub.autoMissCompensation, true, "Новые абонементы получают новую политику");
  // Существующие проверки ниже проверяют неизменность старой политики.
  sub.autoMissCompensation = undefined;
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
  active.autoMissCompensation = undefined;
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

  // Реальные сервисы, разные календарные дни; посещение исправляется до следующего урока.
  let day = 0;
  const makeLesson = () => {
    const row = { _id: "policy-" + (++day), date: new Date(Date.UTC(2026, 0, day)) };
    lessons.set(row._id, row);
    return row;
  };
  const setup = async (id) => {
    const [s] = await Subscription.create([{ student: id, totalLessons: 8, usedLessons: 0, autoMissCompensation: true }]);
    students.set(id, doc({ _id: id, activeSubscription: s._id }));
    return s;
  };
  const charge = async (s, lesson, present = true) => {
    const coverage = await policyExports.consumeSubscriptionLesson(s, lesson, {});
    if (coverage) await Attendance.create([{
      lesson: lesson._id, student: s.student, chargedSubscription: s._id,
      consumed: coverage === "charged", subscriptionCompensation: coverage === "compensation", present,
    }]);
    return coverage;
  };
  const regular = await setup("regular");
  await charge(regular, makeLesson());
  const missed = makeLesson();
  await charge(regular, missed, false);
  const replacement = makeLesson();
  assert.equal(await charge(regular, replacement, false), "compensation");
  assert.equal(regular.usedLessons, 2, "Первый пропуск: следующий урок не списывается");
  assert.equal(regular.compensatedMissedLesson, missed._id);
  assert.equal(regular.compensationLesson, replacement._id);
  await save(replacement, "regular", "subscription");
  await save(replacement, "regular", "single");
  await save(replacement, "regular", "subscription");
  assert.equal(regular.usedLessons, 2, "Повторы и смена оплаты компенсационного урока не списывают");
  await charge(regular, makeLesson(), false);
  await charge(regular, makeLesson());
  assert.equal(regular.usedLessons, 4, "Следующий пропуск уже не компенсируется");

  const corrected = await setup("corrected");
  const provisional = makeLesson();
  await charge(corrected, provisional, false);
  attendances.get(provisional._id + ":corrected").present = true;
  await charge(corrected, makeLesson());
  assert.equal(corrected.usedLessons, 2, "Исправленное присутствие не считается пропуском");

  const lastMiss = await setup("lastMiss");
  for (let i = 0; i < 8; i++) await charge(lastMiss, makeLesson(), i !== 7);
  assert.equal(policyExports.canRetireSubscription(lastMiss), false, "Восьмой урок ждёт проверки пропуска");
  const ninth = makeLesson();
  await save(ninth, "lastMiss", "subscription");
  assert.equal(lastMiss.usedLessons, 8, "Пропуск восьмого покрывает девятый без списания");
  assert.equal(lastMiss.compensationLesson, ninth._id);
  assert.equal(students.get("lastMiss").activeSubscription, null);
  const countBeforeRepeat = subscriptions.size;
  await save(ninth, "lastMiss", "subscription");
  assert.equal(subscriptions.size, countBeforeRepeat, "Повтор последней компенсации не создаёт новый абонемент");

  const lastPresent = await setup("lastPresent");
  for (let i = 0; i < 8; i++) await charge(lastPresent, makeLesson());
  assert.equal(await charge(lastPresent, makeLesson()), null, "Без пропусков девятый урок не покрывается");

  const beforeLast = await setup("beforeLast");
  for (let i = 0; i < 7; i++) await charge(beforeLast, makeLesson(), i !== 6);
  await charge(beforeLast, makeLesson());
  assert.equal(beforeLast.usedLessons, 7, "Компенсация на восьмом уроке сохраняет остаток 1");
  assert.equal(policyExports.canRetireSubscription(beforeLast), false);
  await charge(beforeLast, makeLesson());
  assert.equal(policyExports.canRetireSubscription(beforeLast), true);

  const dated = await setup("dated");
  const current = makeLesson();
  await charge(dated, current, false);
  const past = { _id: "past-policy", date: new Date(Date.UTC(2025, 0, 1)) };
  lessons.set(past._id, past);
  await charge(dated, past);
  assert.equal(dated.compensationLesson, undefined, "Задняя дата не активирует компенсацию");
  assert.equal(dated.lastChargedLesson, current._id);

  // Автоматическое создание урока и отметка оплаты используют одну политику.
  const automatic = await setup("automatic");
  const previous = { _id: "yesterday-policy", date: new Date(today.getTime() - 86400000) };
  lessons.set(previous._id, previous);
  await charge(automatic, previous, false);
  const autoCreated = await lessonExports.createGroupLesson({ _id: "auto-group", students: ["automatic"] }, today);
  assert.equal(automatic.usedLessons, 1);
  assert.equal(attendances.get(autoCreated.lesson._id + ":automatic").subscriptionCompensation, true);
  await lessonExports.createGroupLesson({ _id: "auto-group", students: ["automatic"] }, today);
  await save(autoCreated.lesson, "automatic", "subscription");
  assert.equal(automatic.usedLessons, 1, "Автоматическая компенсация и повторное присутствие не списывают");
  const autoLast = await setup("autoLast");
  for (let i = 8; i > 0; i--) {
    const prior = { _id: "auto-last-" + i, date: new Date(today.getTime() - i * 86400000) };
    lessons.set(prior._id, prior);
    await charge(autoLast, prior, i !== 1);
  }
  const autoLastCreated = await lessonExports.createGroupLesson({ _id: "last-group", students: ["autoLast"] }, today);
  assert.equal(autoLast.usedLessons, 8);
  assert.equal(attendances.get(autoLastCreated.lesson._id + ":autoLast").subscriptionCompensation, true);
  assert.equal(students.get("autoLast").activeSubscription, null, "Последняя компенсация завершает абонемент");

  const autoNoMiss = await setup("autoNoMiss");
  autoNoMiss.usedLessons = 8;
  const attendedLast = { _id: "attended-last", date: new Date(today.getTime() - 86400000) };
  lessons.set(attendedLast._id, attendedLast);
  autoNoMiss.lastChargedLesson = attendedLast._id;
  await Attendance.create([{ lesson: attendedLast._id, student: "autoNoMiss", chargedSubscription: autoNoMiss._id, consumed: true, present: true }]);
  const noMissCreated = await lessonExports.createGroupLesson({ _id: "no-miss-group", students: ["autoNoMiss"] }, today);
  assert.equal(students.get("autoNoMiss").activeSubscription, null);
  assert.equal(attendances.has(noMissCreated.lesson._id + ":autoNoMiss"), false, "Исчерпанный абонемент без пропусков не покрывает следующий урок");
  const legacyMiss = await setup("legacyMiss");
  legacyMiss.autoMissCompensation = undefined;
  await charge(legacyMiss, makeLesson(), false);
  await charge(legacyMiss, makeLesson());
  assert.equal(legacyMiss.usedLessons, 2, "Старые абонементы не получают автоматическую компенсацию");

  const sameDay = await setup("sameDay");
  const firstSameDay = makeLesson();
  await charge(sameDay, firstSameDay, false);
  const secondSameDay = { _id: "same-day-2", date: firstSameDay.date };
  lessons.set(secondSameDay._id, secondSameDay);
  await charge(sameDay, secondSameDay);
  assert.equal(sameDay.compensationLesson, undefined, "Отметки текущего дня не считаются окончательным пропуском");
  console.log("OK: политика списания, смена оплаты, повторы, последний урок и задние даты (без БД)");
})().catch((error) => { console.error(error); process.exitCode = 1; });

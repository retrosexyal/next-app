const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
let state;
const query = (value) => ({ session: async () => value, sort: () => query(value) });
const doc = (value) => Object.assign(value, { save: async () => {} });
const mocks = {
  "@/services/subscription-policy": { canRetireSubscription: (s) => s.usedLessons >= s.totalLessons && (!s.autoMissCompensation || Boolean(s.compensationLesson)) },
  mongoose: { startSession: async () => ({
    withTransaction: async (fn) => {
      const before = JSON.stringify(state);
      try { await fn(); } catch (error) { state = JSON.parse(before); throw error; }
    }, endSession: async () => {},
  }) },
  "@/models/lesson-model": {
    findOneAndDelete: async ({ _id, group }) => {
      const lesson = state.lessons.find((l) => l._id === _id && l.group === group);
      state.lessons = state.lessons.filter((l) => l !== lesson);
      return lesson;
    },
    findOne: ({ _id }) => query(state.lessons.filter((l) => _id.$in.includes(l._id)).sort((a,b) => b.date - a.date)[0]),
  },
  "@/models/attendance-model": {
    find: (filter) => query(state.rows.filter((r) => filter.lesson ? r.lesson === filter.lesson :
      r.student === filter.student && r.consumed && !r.refunded &&
      (r.chargedSubscription || r.payment?.paymentId) === filter.$or[0].chargedSubscription)),
    deleteMany: async ({ lesson }) => { state.rows = state.rows.filter((r) => r.lesson !== lesson); },
  },
  "@/models/subscription-model": {
    find: () => query(state.subs.map(doc)),
    findOne: ({ _id, student }) => query(state.subs.find((s) => s._id === _id && s.student === student)),
  },
  "@/models/group-student-model": { findById: (id) => query(state.students.find((s) => s._id === id)) },
};
const service = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync("services/lesson-deletion-service.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, { exports: service, require: (name) => mocks[name] });
function setup() {
  state = {
    lessons: [{ _id: "wrong", group: "g", date: 2 }, { _id: "previous", group: "g", date: 1 }],
    rows: [{ lesson: "wrong", student: "s", consumed: true, chargedSubscription: "old", present: false },
      { lesson: "previous", student: "s", consumed: true, chargedSubscription: "old" }],
    subs: [doc({ _id: "old", student: "s", usedLessons: 8, totalLessons: 8, lastChargedLesson: "wrong" })],
    students: [doc({ _id: "s", activeSubscription: null })],
  };
}
(async () => {
  setup();
  assert.equal((await service.deleteGroupLesson("wrong", "other")).refundedLessons, 0);
  assert.equal(state.lessons.length, 2);
  assert.equal((await service.deleteGroupLesson("wrong", "g")).refundedLessons, 1);
  assert.equal(state.subs[0].usedLessons, 7);
  assert.equal(state.students[0].activeSubscription, "old");
  assert.equal(state.subs[0].lastChargedLesson, "previous");
  assert.equal(state.rows.length, 1);
  assert.equal((await service.deleteGroupLesson("wrong", "g")).refundedLessons, 0);
  setup();
  state.rows[0].source = "single"; // Оплата изменена, списание осталось.
  state.students[0].activeSubscription = "new";
  state.subs.push(doc({ _id: "new", student: "s", usedLessons: 1, totalLessons: 8 }));
  await service.deleteGroupLesson("wrong", "g");
  assert.equal(state.subs[1].totalLessons, 9);
  assert.equal(state.subs[0].totalLessons, state.subs[0].usedLessons);
  setup();
  delete state.rows[0].chargedSubscription;
  state.rows[0].payment = { paymentId: "old" };
  await service.deleteGroupLesson("wrong", "g");
  assert.equal(state.subs[0].usedLessons, 7, "Старые списания возвращаются");
  setup();
  state.rows[0].refunded = true;
  await service.deleteGroupLesson("wrong", "g");
  assert.equal(state.subs[0].usedLessons, 8, "Ранее возвращённое не возвращается дважды");
  setup();
  state.rows[0].consumed = false;
  state.rows[0].subscriptionCompensation = true;
  state.subs[0].compensationLesson = "wrong";
  state.subs[0].autoMissCompensation = true;
  state.subs[0].compensatedMissedLesson = "previous";
  await service.deleteGroupLesson("wrong", "g");
  assert.equal(state.subs[0].usedLessons, 8);
  assert.equal(state.subs[0].compensationLesson, undefined);
  assert.equal(state.subs[0].compensatedMissedLesson, undefined);
  assert.equal(state.students[0].activeSubscription, "old", "Право на компенсацию снова доступно");
  setup();
  state.rows[0].chargedSubscription = "missing";
  await assert.rejects(() => service.deleteGroupLesson("wrong", "g"), /Удаление отменено/);
  assert.equal(state.lessons.length, 2, "Ошибка отменяет удаление");
  assert.equal(state.rows.length, 2);
  assert.equal(state.subs[0].usedLessons, 8);
  console.log("OK: возврат списаний, старые записи, новый абонемент, компенсация, повтор и отмена при ошибке (без БД)");
})().catch((error) => { console.error(error); process.exitCode = 1; });

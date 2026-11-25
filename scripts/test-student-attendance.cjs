const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const mod = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('services/student-attendance-summary.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: mod.exports, module: mod, Date, Map });
const summary = mod.exports.studentAttendanceSummary;
const lessons = ['09-03','09-07','09-10','09-14','09-21','10-01','10-08','11-01','11-24','11-30'].map((d,i) => ({ _id: String(i), group: 'g', date: `2026-${d}T00:00:00Z` }));
const marks = new Map(lessons.slice(0,5).map(l => [l._id, { present: true }]));
const result = summary({ _id: 's' }, [{ _id: 'g', students: [] }], lessons, marks, '2026-09-01', '2026-11-25');
assert.equal(result.eligible.length, 9);
assert.equal(result.attended.length, 5);
assert.equal(Math.round(result.attended.length / result.eligible.length * 100), 56);
const october = summary({ _id: 's' }, [], lessons, marks, '2026-10-01', '2026-11-25');
assert.equal(october.eligible.length, 4);
assert.equal(october.attended.length, 0);
const joined = summary({ _id: 's', groupJoinedAt: { g: '2026-10-01' } }, [{ _id: 'g', students: ['s'] }], lessons, new Map(), '2026-09-01', '2026-11-25');
assert.equal(joined.eligible.length, 9);
const novemberMarks = new Map(lessons.slice(7,9).map(l => [l._id, { present: true }]));
for (const groups of [[{ _id: 'g', students: ['s'] }], []]) {
  const november = summary({ _id: 's', groupJoinedAt: { g: '2026-11-01' } }, groups, lessons, novemberMarks, '2026-09-01', '2026-11-25');
  assert.equal(november.eligible.length, 9);
  assert.equal(november.attended.length, 2);
  assert.equal(Math.round(november.attended.length / november.eligible.length * 100), 22);
}
console.log('Attendance checks passed: period, missing marks, historical group, join date, future lessons.');

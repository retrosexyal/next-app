const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks) {
  const module = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(output, {
    module, exports: module.exports, global: {}, Date,
    require(name) {
      if (!(name in mocks)) throw new Error(`Unexpected import: ${name}`);
      return mocks[name];
    },
  }, { filename: file });
  return module.exports;
}

async function main() {
  const groupId = '111111111111111111111111';
  const studentId = '222222222222222222222222';
  const group = { ownerEmail: 'teacher@example.com', students: [studentId] };
  let identity = { email: 'admin@admin' };
  let saves = 0;
  const student = { messages: [], async save() { saves++; } };
  const helpers = load('helpers/helpers.ts', {
    '@/services/token-service': { tokenService: { validateAccessToken: () => identity } },
    '@/models/group-model': { findById: async id => id === groupId ? group : null },
    '@/models/teacher-model': { exists: async ({ email }) => ['teacher@example.com', 'other@example.com'].includes(email) },
    mongoose: { connect: async () => ({}) },
    process: { env: { DB_URL: 'mock' } },
  });
  const handler = load('pages/api/groups/mark-for-student.ts', {
    '@/helpers/helpers': helpers,
    '@/models/group-student-model': { findById: async id => id === studentId ? student : null },
    mongoose: { isValidObjectId: value => typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value) },
  }).default;
  async function call(body, method = 'POST') {
    const res = { code: 200, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; }, end() {} };
    await handler({ method, headers: { authorization: 'Bearer mock' }, body: { groupId, studentId, ...body } }, res);
    return res;
  }

  assert.equal((await call({ action: 'add', text: '  Заметка администратора  ' })).code, 200);
  assert.equal(student.messages[0].text, 'Заметка администратора');
  // Mongoose supplies the UUID on push; assign it here for the in-memory model.
  student.messages[0].uuid = 'note-uuid';
  identity = { email: group.ownerEmail };
  assert.equal((await call({ action: 'edit', messageUuid: 'note-uuid', text: 'Исправлено преподавателем' })).code, 200);
  assert.equal(student.messages[0].text, 'Исправлено преподавателем');
  const savedBeforeDenials = saves;
  identity = { email: 'other@example.com' };
  for (const action of ['add', 'edit', 'delete']) {
    assert.equal((await call({ action, text: 'Чужая заметка', messageUuid: 'note-uuid' })).code, 403);
  }
  identity = { email: group.ownerEmail };
  assert.equal((await call({ action: 'add', text: ' ', })).code, 400);
  assert.equal((await call({ action: 'add', text: 'Текст', studentId: '333333333333333333333333' })).code, 403);
  assert.equal((await call({ action: 'add', text: 'Текст', groupId: undefined })).code, 400);
  assert.equal((await call({ action: 'edit', text: 'Текст' })).code, 400);
  assert.equal((await call({ action: 'unknown' })).code, 400);
  assert.equal((await call({ action: 'edit', text: 'Текст', messageUuid: 'missing' })).code, 404);
  assert.equal((await call({}, 'GET')).code, 405);
  assert.equal(saves, savedBeforeDenials);
  assert.equal((await call({ action: 'delete', messageUuid: 'note-uuid' })).code, 200);
  assert.equal(student.messages.length, 0);
  identity = null;
  assert.equal((await call({ action: 'add', text: 'Текст' })).code, 403);
  identity = { email: 'student@example.com' };
  assert.equal((await call({ action: 'add', text: 'Текст' })).code, 403);
  console.log('PASS: administrator creates a shared note, group teacher edits and deletes it; unrelated teachers, students, invalid requests and empty notes are rejected.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });

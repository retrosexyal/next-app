const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks) {
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports, process, console, Date, URL,
    require: (name) => { if (!(name in mocks)) throw new Error(`Unexpected import: ${name}`); return mocks[name]; },
  }, { filename: file });
  return module.exports;
}

async function main() {
  let user = { _id: 'user', email: 'test@example.com', activationLink: 'test-link', isActivated: false };
  let sent = 0;
  let failMail = false;
  const model = {
    findById: async () => user,
    findOneAndUpdate: async (filter, update) => {
      assert.equal(filter._id, 'user');
      assert.equal(filter.isActivated, false);
      assert.ok(filter.$or.some(condition => condition.activationEmailNextAllowedAt === null));
      if (!user || user.isActivated || user.activationEmailNextAllowedAt > filter.$or[0].activationEmailNextAllowedAt.$lte) return null;
      Object.assign(user, update.$set);
      return user;
    },
  };
  const previousURL = process.env.URL;
  const previousMinutes = process.env.ACTIVATION_RESEND_MINUTES;
  process.env.URL = 'https://example.com/';
  process.env.ACTIVATION_RESEND_MINUTES = '5';
  try {
    const service = load('services/activation-service.ts', {
      '@/models/user-model': model,
      '@/config/nodemailer': { mailOptionsRegist: email => ({ to: email }), transporter: {
        sendMail: async (mail) => { sent++; assert.equal(mail.to, 'test@example.com'); if (failMail) throw new Error('SMTP timeout'); },
      } },
    });
    const results = await Promise.all(Array.from({ length: 10 }, () => service.resendActivationEmail('user')));
    assert.equal(sent, 1);
    assert.equal(results.filter(r => r.status === 200).length, 1);
    assert.equal(results.filter(r => r.status === 429).length, 9);
    assert.ok(results[1].retryAfter > 0 && results[1].retryAfter <= 300);
    user.activationEmailNextAllowedAt = new Date(Date.now() - 1);
    assert.equal((await service.resendActivationEmail('user')).status, 200);
    user.activationEmailNextAllowedAt = new Date(Date.now() - 1);
    failMail = true;
    assert.equal((await service.resendActivationEmail('user')).status, 503);
    assert.equal((await service.resendActivationEmail('user')).status, 429);
    user.isActivated = true;
    assert.equal((await service.resendActivationEmail('user')).status, 409);
    process.env.ACTIVATION_RESEND_MINUTES = 'invalid';
    assert.equal(service.activationCooldownMs(), 300000);
    process.env.ACTIVATION_RESEND_MINUTES = '10';
    assert.equal(service.activationCooldownMs(), 600000);

    let identity = { id: 'user', isActivated: true };
    let session = {};
    const { settingsAccess } = load('helpers/settings-access.ts', {
      '@/helpers/helpers': { connectDB: async () => {} },
      '@/models/user-model': model,
      '@/services/token-service': { tokenService: {
        validateRefreshToken: () => identity, findToken: async () => session,
      } },
    });
    const context = { req: { cookies: { refreshToken: 'token' } }, res: { setHeader() {} } };
    user.isActivated = false;
    assert.equal((await settingsAccess(context)).redirect.destination, '/activation');
    user.isActivated = true;
    identity.isActivated = false;
    assert.ok((await settingsAccess(context)).props);
    session = null;
    assert.equal((await settingsAccess(context)).redirect.destination, '/');
    identity = null;
    assert.equal((await settingsAccess(context)).redirect.destination, '/');

    const login = fs.readFileSync('components/login/index.tsx', 'utf8');
    assert.match(login, /if \(userData\.isActivated\)\s*\{\s*handleLogin\(\);\s*router\.push\("\/settings"\)/);
    assert.match(login, /AuthService\.registration[\s\S]*?localStorage\.setItem\("token", data\.accessToken\)/);
    console.log('PASS: concurrent resend, cooldown expiry, SMTP failure, activated account, configurable interval, server access using current DB state, revoked session, login and registration regressions.');
  } finally {
    if (previousURL === undefined) delete process.env.URL; else process.env.URL = previousURL;
    if (previousMinutes === undefined) delete process.env.ACTIVATION_RESEND_MINUTES; else process.env.ACTIVATION_RESEND_MINUTES = previousMinutes;
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

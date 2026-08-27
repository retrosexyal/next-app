const { loadEnvConfig } = require("@next/env");
const mongoose = require("mongoose");

loadEnvConfig(process.cwd());

const legacyEmails = ["liza@limi.by", "alesia@limi.by", "arina@limi.by"];

async function migrate() {
  if (!process.env.DB_URL) throw new Error("DB_URL is not defined");
  await mongoose.connect(process.env.DB_URL);

  const userCollection = mongoose.connection.collection("users");
  const teacherCollection = mongoose.connection.collection("teachers");
  const users = await userCollection
    .find({ email: { $in: legacyEmails } }, { projection: { email: 1 } })
    .toArray();
  const existingEmails = new Set(users.map(({ email }) => email));
  const missingEmails = legacyEmails.filter((email) => !existingEmails.has(email));

  if (missingEmails.length) {
    throw new Error(
      `Сначала создайте пользователей для: ${missingEmails.join(", ")}`,
    );
  }

  for (const email of legacyEmails) {
    await teacherCollection.updateOne(
      { email },
      { $setOnInsert: { email, createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true },
    );
  }

  await teacherCollection.createIndex({ email: 1 }, { unique: true });
  console.log(`Добавлено/проверено преподавателей: ${legacyEmails.length}`);
}

migrate()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

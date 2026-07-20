import { mailOptionsBirthday, transporter } from "@/config/nodemailer";
import { connectDB } from "@/helpers/helpers";
import "@/models/group-student-model";
import Group from "@/models/group-model";
import { adminService } from "@/services/admin-service";
import { NextApiRequest, NextApiResponse } from "next";

type BirthdayStudent = {
  name: string;
  place?: string;
};

type StudentsByGroup = Map<string, BirthdayStudent[]>;

const getStudentsLabel = (count: number) => {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "учеников";
  if (lastDigit === 1) return "ученика";
  if (lastDigit >= 2 && lastDigit <= 4) return "учеников";
  return "учеников";
};

const normalizeName = (name: string) =>
  name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("ru");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const hasBirthdayToday = (birthday: string, day: number, month: number) => {
  const parts = birthday.trim().split(/[.\-/]/);

  if (parts.length < 2) return false;

  // Поддерживаем оба используемых формата: DD.MM.YYYY и YYYY-MM-DD.
  const isIsoDate = parts[0].length === 4;
  const birthdayDay = Number(isIsoDate ? parts[2] : parts[0]);
  const birthdayMonth = Number(parts[1]);

  return birthdayDay === day && birthdayMonth === month;
};

const buildEmailHtml = (
  studentsByGroup: StudentsByGroup,
  studentsCount: number,
) => {
  const groupsHtml = Array.from(studentsByGroup.entries())
    .sort(([firstGroup], [secondGroup]) =>
      firstGroup.localeCompare(secondGroup, "ru"),
    )
    .map(([groupTitle, students]) => {
      const studentsHtml = students
        .sort((first, second) => first.name.localeCompare(second.name, "ru"))
        .map(
          (student) => `
            <tr>
              <td style="padding: 14px 16px; border-top: 1px solid #eeeaf6;">
                <div style="font-size: 16px; line-height: 24px; font-weight: 600; color: #282332;">
                  🎂 ${escapeHtml(student.name)}
                </div>
                ${
                  student.place
                    ? `<div style="margin-top: 3px; font-size: 13px; line-height: 18px; color: #777080;">
                        Место занятий: ${escapeHtml(student.place)}
                      </div>`
                    : ""
                }
              </td>
            </tr>`,
        )
        .join("");

      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
          style="margin-top: 18px; border: 1px solid #e7e1f0; border-radius: 14px; border-collapse: separate; overflow: hidden; background: #ffffff;">
          <tr>
            <td style="padding: 13px 16px; background: #f5f0fb;">
              <div style="font-size: 12px; line-height: 18px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: #76539b;">
                Группа
              </div>
              <div style="margin-top: 2px; font-size: 19px; line-height: 26px; font-weight: 700; color: #352b40;">
                ${escapeHtml(groupTitle)}
              </div>
            </td>
          </tr>
          ${studentsHtml}
        </table>`;
    })
    .join("");

  const content = studentsCount
    ? `
      <p style="margin: 0; font-size: 16px; line-height: 25px; color: #5f5867;">
        Сегодня нужно поздравить <strong style="color: #352b40;">${studentsCount}</strong>
        ${getStudentsLabel(studentsCount)}.
        Именинники разделены по группам:
      </p>
      ${groupsHtml}`
    : `
      <div style="padding: 22px; border-radius: 14px; background: #f5f0fb; text-align: center;">
        <div style="font-size: 30px; line-height: 38px;">✨</div>
        <p style="margin: 8px 0 0; font-size: 16px; line-height: 24px; color: #5f5867;">
          Сегодня дней рождения нет.
        </p>
      </div>`;

  return `
    <!doctype html>
    <html lang="ru">
      <body style="margin: 0; padding: 0; background: #f4f2f6; font-family: Arial, Helvetica, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f4f2f6;">
          <tr>
            <td align="center" style="padding: 28px 12px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="max-width: 620px; border-radius: 18px; background: #ffffff; box-shadow: 0 8px 28px rgba(52, 40, 65, 0.08);">
                <tr>
                  <td style="padding: 28px 28px 24px; border-radius: 18px 18px 0 0; background: #76539b;">
                    <div style="font-size: 13px; line-height: 20px; font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; color: #eadff5;">
                      Ежедневное напоминание
                    </div>
                    <h1 style="margin: 5px 0 0; font-size: 27px; line-height: 35px; color: #ffffff;">
                      Дни рождения сегодня
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 26px 28px 30px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
};

const buildEmailText = (studentsByGroup: StudentsByGroup) => {
  if (!studentsByGroup.size) return "Сегодня дней рождения нет.";

  const groups = Array.from(studentsByGroup.entries())
    .sort(([firstGroup], [secondGroup]) =>
      firstGroup.localeCompare(secondGroup, "ru"),
    )
    .map(
      ([groupTitle, students]) =>
        `${groupTitle}:\n${students
          .map(
            (student) =>
              `- ${student.name}${
                student.place ? ` (место занятий: ${student.place})` : ""
              }`,
          )
          .join("\n")}`,
    );

  return `Дни рождения сегодня\n\n${groups.join("\n\n")}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Метод не поддерживается" });
  }

  try {
    await connectDB();

    const [students, groups] = await Promise.all([
      adminService.getAllStudents(),
      Group.find()
        .select("title students")
        .populate({ path: "students", select: "fullName" })
        .lean(),
    ]);

    const minskDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Minsk",
      day: "numeric",
      month: "numeric",
    }).formatToParts(new Date());
    const dayToday = Number(
      minskDate.find((part) => part.type === "day")?.value,
    );
    const monthToday = Number(
      minskDate.find((part) => part.type === "month")?.value,
    );

    const groupTitlesByStudent = new Map<string, Set<string>>();

    groups.forEach((group: any) => {
      group.students.forEach(
        (student: { fullName?: string } | null) => {
          if (!student?.fullName) return;

          const normalizedName = normalizeName(student.fullName);
          const groupTitles =
            groupTitlesByStudent.get(normalizedName) ?? new Set<string>();
          groupTitles.add(group.title);
          groupTitlesByStudent.set(normalizedName, groupTitles);
        },
      );
    });

    const studentsByGroup: StudentsByGroup = new Map();
    const birthdayStudents = students.filter((student) =>
      hasBirthdayToday(student.date, dayToday, monthToday),
    );

    birthdayStudents.forEach((student) => {
      const groupTitles = groupTitlesByStudent.get(
        normalizeName(student.name),
      );
      const resolvedGroupTitles = groupTitles?.size
        ? Array.from(groupTitles)
        : ["Группа не найдена"];

      resolvedGroupTitles.forEach((groupTitle) => {
        const groupStudents = studentsByGroup.get(groupTitle) ?? [];
        groupStudents.push({
          name: student.name,
          place: student.place,
        });
        studentsByGroup.set(groupTitle, groupStudents);
      });
    });

    await transporter.sendMail({
      ...mailOptionsBirthday,
      subject: "Дни рождения сегодня",
      text: buildEmailText(studentsByGroup),
      html: buildEmailHtml(studentsByGroup, birthdayStudents.length),
    });

    return res.status(200).json({
      message: "Письмо отправлено",
      birthdayStudents: birthdayStudents.length,
    });
  } catch (error) {
    console.error("Не удалось отправить письмо о днях рождения:", error);
    return res.status(500).json({ message: "Не удалось отправить письмо" });
  }
}

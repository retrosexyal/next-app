import UserModel from "@/models/user-model";
import { mailOptionsRegist, transporter } from "@/config/nodemailer";

export function activationCooldownMs() {
  const minutes = Number(process.env.ACTIVATION_RESEND_MINUTES ?? 5);
  return (Number.isFinite(minutes) && minutes >= 1 ? minutes : 5) * 60_000;
}

export const retryAfterSeconds = (nextAllowedAt?: Date) =>
  Math.max(0, Math.ceil((new Date(nextAllowedAt ?? 0).getTime() - Date.now()) / 1000));

export async function sendActivationEmail(user: any) {
  const link = new URL(`/api/activate/${user.activationLink}`, process.env.URL).href;
  await transporter.sendMail({
    ...mailOptionsRegist(user.email),
    subject: "Активация аккаунта ЛиМи",
    text: `Для активации учётной записи перейдите по ссылке: ${link}`,
    html: `<p>Для активации учётной записи <a href="${link}">перейдите по ссылке</a>.</p>`,
  });
}

export async function resendActivationEmail(id: string) {
  const now = new Date();
  const nextAllowedAt = new Date(now.getTime() + activationCooldownMs());
  // Claim the delivery atomically across tabs and server instances. Keep the
  // cooldown on SMTP failure too: a timeout can mean the mail was accepted.
  const user = await UserModel.findOneAndUpdate(
    { _id: id, isActivated: false, $or: [
      { activationEmailNextAllowedAt: { $lte: now } },
      { activationEmailNextAllowedAt: null },
    ] },
    { $set: { activationEmailNextAllowedAt: nextAllowedAt } },
    { new: true },
  );
  if (!user) {
    const current = await UserModel.findById(id);
    if (!current) return { status: 401, message: "Войдите в учётную запись" };
    if (current.isActivated) return { status: 409, message: "Учётная запись уже активирована" };
    return { status: 429, message: "Дождитесь окончания таймера", retryAfter: retryAfterSeconds(current.activationEmailNextAllowedAt) };
  }
  try {
    await sendActivationEmail(user);
    return { status: 200, message: "Письмо отправлено. Проверьте также папку «Спам».", retryAfter: retryAfterSeconds(nextAllowedAt) };
  } catch {
    return { status: 503, message: "Не удалось подтвердить отправку письма. Попробуйте снова после окончания таймера.", retryAfter: retryAfterSeconds(nextAllowedAt) };
  }
}

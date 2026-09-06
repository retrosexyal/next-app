import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import AuthService from "@/clientServices/AuthService";
import api from "@/http";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/userSlice";
import styles from "./activation-notice.module.scss";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function ActivationNotice({ email, onActivated }: { email: string; onActivated?: () => void }) {
  const [deadline, setDeadline] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const applyCooldown = (seconds = 0) => {
    setDeadline(Date.now() + seconds * 1000);
    setRemaining(seconds);
  };

  useEffect(() => {
    let active = true;
    api.get("/api/activation").then(({ data }) => {
      if (active) applyCooldown(data.retryAfter);
    }).catch(() => {
      if (active) setMessage("Не удалось проверить время отправки. Попробуйте ещё раз.");
    }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [email]);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const resend = async () => {
    if (busy || remaining > 0) return;
    setBusy(true);
    try {
      const { data } = await api.post("/api/activation");
      applyCooldown(data.retryAfter);
      setMessage(data.message);
    } catch (error: any) {
      applyCooldown(error.response?.data?.retryAfter);
      setMessage(error.response?.data?.message ?? "Не удалось отправить письмо. Попробуйте позже.");
    } finally { setBusy(false); }
  };

  const checkActivation = async () => {
    setBusy(true);
    try {
      const { data } = await AuthService.refresh();
      localStorage.setItem("token", data.accessToken);
      dispatch(setUser(data.user));
      if (data.user.isActivated) {
        await router.push("/settings");
        onActivated?.();
      }
      else setMessage("Почта пока не подтверждена. Перейдите по ссылке в письме.");
    } catch { setMessage("Не удалось проверить активацию. Войдите в учётную запись повторно."); }
    finally { setBusy(false); }
  };

  return <div className={styles.notice}>
    <div className={styles.email_card}>
      <span>Письмо для активации отправлено на</span>
      <strong>{email}</strong>
    </div>
    <p className={styles.instructions}>Откройте письмо и перейдите по ссылке внутри.<br />Затем вернитесь сюда, чтобы продолжить.</p>
    <Button className={styles.primary} variant="contained" disableElevation disabled={busy} onClick={checkActivation} endIcon={<ArrowForwardRoundedIcon />}>
      {busy ? "Подождите…" : "Я подтвердил почту"}
    </Button>
    <div className={styles.resend}>
      <p>Нет письма? Загляните в папку «Спам».</p>
      <Button className={styles.secondary} disabled={!ready || busy || remaining > 0} onClick={resend}>Отправить повторно</Button>
      {remaining > 0 && <span className={styles.timer}>Можно повторить через <b>{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</b></span>}
    </div>
    {message && <p className={styles.status} role="status" aria-live="polite">{message}</p>}
  </div>;
}

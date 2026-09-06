import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ActivationNotice from "@/components/activation-notice";
import AuthService from "@/clientServices/AuthService";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/userSlice";

export default function Activation() {
  const [email, setEmail] = useState("");
  const [failed, setFailed] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    AuthService.refresh().then(({ data }) => {
      localStorage.setItem("token", data.accessToken);
      dispatch(setUser(data.user));
      if (data.user.isActivated) router.replace("/settings");
      else setEmail(data.user.email);
    }).catch(() => setFailed(true));
  }, [dispatch, router]);
  return <main className="wrapper" style={{ maxWidth: 600, padding: "80px 24px" }}>
    <Head><title>Активация учётной записи</title><meta name="robots" content="noindex, nofollow" /></Head>
    <h1>Подтвердите почту</h1>
    {email ? <ActivationNotice email={email} /> : <p>{failed ? "Войдите в учётную запись, чтобы продолжить активацию." : "Загрузка…"}</p>}
    <Link href="/">На главную</Link>
  </main>;
}

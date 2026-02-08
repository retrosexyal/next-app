import styles from "./toast.module.scss";

export function Toast({
  visible,
  message,
  type,
}: {
  visible: boolean;
  message: string;
  type: "loading" | "success" | "error";
}) {
  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {type === "loading" && "⏳ "}
      {type === "success" && "✅ "}
      {type === "error" && "❌ "}
      {message}
    </div>
  );
}

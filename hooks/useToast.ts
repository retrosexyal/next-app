import { useCallback, useState } from "react";

export type ToastType = "loading" | "success" | "error";

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "loading",
  });

  const show = useCallback(
    (message: string, type: ToastType = "loading") => {
      setToast({
        visible: true,
        message,
        type,
      });
    },
    [],
  );

  const hide = useCallback(() => {
    setToast((t) => ({ ...t, visible: false }));
  }, []);

  const success = useCallback((message: string) => {
    show(message, "success");
    setTimeout(hide, 2000);
  }, [show, hide]);

  const error = useCallback((message: string) => {
    show(message, "error");
    setTimeout(hide, 3000);
  }, [show, hide]);

  const loading = useCallback((message: string) => {
    show(message, "loading");
  }, [show]);

  return {
    toast,
    show,
    hide,
    success,
    error,
    loading,
  };
}

type ToastApi = {
  loading: (msg: string) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
  hide: () => void;
};

interface ToastFetchOptions extends RequestInit {
  loadingMessage?: string;
  successMessage?: string;
  silent?: boolean; // если true — не показываем success
}

export async function toastFetch<T = any>(
  toast: ToastApi,
  url: string,
  options: ToastFetchOptions = {},
): Promise<T> {
  const {
    loadingMessage = "Загрузка...",
    successMessage,
    silent,
    ...fetchOptions
  } = options;

  try {
    toast.loading(loadingMessage);

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      let message = "Ошибка сервера";
      try {
        const err = await res.json();
        message = err.message || message;
      } catch {}
      throw new Error(message);
    }

    const data = await res.json();

    if (!silent && successMessage) {
      toast.success(successMessage);
    } else {
      toast.hide();
    }

    return data;
  } catch (e: any) {
    toast.error(e.message || "Ошибка сети");
    throw e;
  }
}

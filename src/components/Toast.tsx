"use client";

import useToastStore from "@/store/useToastStore";

function Toast() {
  const toasts = useToastStore(state => state.toasts);
  const removeToast = useToastStore(state => state.removeToast);

  return (
    <div className="fixed bottom-10 left-1/2 z-50 min-w-[200px] -translate-x-1/2 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-2 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-yellow-primary"
              : toast.type === "error"
                ? "bg-red-400"
                : "bg-blue-400"
          } text-white`}
          role="alert"
        >
          <div className="flex items-center justify-between space-x-2">
            <span className="t">{toast.message}</span>
            <button
              className="ml-2 text-white hover:text-gray-200"
              onClick={() => removeToast(toast.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Toast;
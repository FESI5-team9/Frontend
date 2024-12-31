"use client";

import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "notification";
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastState>(set => ({
  toasts: [],
  addToast: toast => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    set(state => ({ toasts: [...state.toasts, newToast] }));

    // 별도의 setTimeout 호출
    const timeoutId = setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id),
      }));
    }, 3000);

    // cleanup을 위해 timeoutId 저장
    return () => clearTimeout(timeoutId);
  },
  removeToast: id => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },
}));

export default useToastStore;

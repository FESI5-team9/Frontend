"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ModalProps } from "@/types/components/modalPopup";

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // 페이지 스크롤 막기
      document.body.style.position = "fixed"; // 화면 고정
      document.body.style.width = "100%"; // 스크롤바 영역 보정
      document.body.style.top = `-${window.scrollY}px`; // 현재 위치 유지
      document.addEventListener("keydown", handleEsc);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = ""; // 스크롤 허용
      document.body.style.position = ""; // 초기화
      document.body.style.width = ""; // 초기화
      document.body.style.top = ""; // 초기화
      window.scrollTo(0, parseInt(scrollY || "0") * -1); // 원래 위치로 복원
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex max-h-[80vh] w-96 flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
        <div className="flex flex-row justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <button
            className="right-2 top-2 text-gray-500 hover:text-gray-800"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <Image src="/icons/X.svg" width={20} height={20} alt="X" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

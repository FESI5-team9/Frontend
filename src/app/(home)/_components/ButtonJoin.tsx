"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinGathering } from "@/apis/assignGatheringApi";
import useToastStore from "@/store/useToastStore";
import useUserStore from "@/store/userStore";

export default function ButtonJoin({
  id,
  participation,
  onUpdate,
}: {
  id: number;
  participation: boolean;
  onUpdate: () => void;
}) {
  const [isParticipation, setIsParticipation] = useState(participation);
  const addToast = useToastStore(state => state.addToast);

  const { id: userId } = useUserStore(); // 로그인 상태 확인
  const router = useRouter();

  async function handleJoinGathering() {
    try {
      const response = await joinGathering(id);
      setIsParticipation(true);
      onUpdate();
      addToast({ message: response.message, type: "success" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 에러가 발생했습니다.";
      console.error("참여 실패:", errorMessage);
      addToast({ message: errorMessage, type: "error" });
    }
  }

  return (
    <div>
      {!userId ? ( // 로그인 안 되어 있으면 무조건 참여하기만 보여줌
        <button
          onClick={() => router.push("/signin")}
          className="h-[40px] w-[100px] rounded-xl border bg-yellow-primary text-black"
        >
          참여하기
        </button>
      ) : isParticipation ? ( // 로그인 상태에서 참여 여부 확인
        <div className="flex h-[40px] w-[100px] items-center rounded-xl border bg-gray-400 px-5 text-base font-semibold text-gray-100">
          참여완료
        </div>
      ) : (
        <button
          onClick={() => handleJoinGathering()}
          className="h-[40px] w-[100px] rounded-xl border bg-yellow-primary text-black"
        >
          참여하기
        </button>
      )}
    </div>
  );
}

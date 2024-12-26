"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinGathering } from "@/apis/assignGatheringApi";
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
  const [, setToast] = useState(false);
  const { id: userId } = useUserStore(); // 로그인 상태 확인
  const router = useRouter();

  async function handleJoinGathering() {
    try {
      if (!userId) {
        router.push("/signin");
        return;
      }
      joinGathering(id);
      alert("모임을 참여했습니다! 🎉");
      setIsParticipation(true);
      onUpdate();
      setToast(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 에러가 발생했습니다.";

      if (errorMessage === "이미 참여한 모임입니다.") {
        alert("이미 참여가 된 모임입니다.");
      } else {
        alert(errorMessage || "참여에 실패했습니다. 다시 시도해주세요.");
      }

      console.error("참여 실패:", errorMessage);
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

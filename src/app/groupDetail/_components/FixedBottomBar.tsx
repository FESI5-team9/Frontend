"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CancelGathering, LeaveGathering, joinGathering } from "@/apis/assignGatheringApi";
import Button from "@/components/Button/Button";
import useUserStore from "@/store/userStore";
import { GatheringDetailRes, Participant } from "@/types/api/gatheringApi";

type FixedBottomBarProps = {
  data: GatheringDetailRes;
  gatheringId: number;
  toggleEditModal: () => void;
};

export default function FixedBottomBar({
  data,
  gatheringId,
  toggleEditModal,
}: FixedBottomBarProps) {
  const [status, setStatus] = useState<"join" | "cancelJoin" | "closed" | "host" | "canceled">(
    "join",
  );

  const userInfo = useUserStore();
  const router = useRouter();

  const checkParticipationStatus = useCallback(
    (participants: Participant[]) =>
      participants.some(participant => participant.userId === userInfo.id),
    [userInfo.id],
  );

  const determineStatus = useCallback(() => {
    if (data.canceledAt) {
      setStatus("canceled");
    } else if (data.host) {
      setStatus("host");
    } else if (data.status === "RECRUITING") {
      setStatus(checkParticipationStatus(data.participants) ? "cancelJoin" : "join");
    } else setStatus("closed");
  }, [checkParticipationStatus, data]);

  useEffect(() => {
    determineStatus();
  }, [data, determineStatus]);

  const handleJoin = async () => {
    if (!userInfo.id) return router.push("/signin");

    try {
      await joinGathering(gatheringId);
      setStatus("cancelJoin");
    } catch (err) {
      console.error("Failed to join gathering:", err);
    }
  };

  const handleLeave = async () => {
    try {
      await LeaveGathering(gatheringId);
      setStatus("join");
    } catch (err) {
      console.error("Failed to leave gathering:", err);
    }
  };

  const handleCancel = async () => {
    try {
      await CancelGathering(gatheringId);
      alert("모임 취소가 완료되었습니다.");
    } catch (err) {
      console.error("Failed to cancel gathering:", err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-[2] max-h-[134px] w-full border-t-2 bg-white tablet:h-[84px] desktop:h-[87px]">
      <div
        className={`mx-auto flex max-w-[744px] ${status === "host" ? "flex-wrap" : "flex-nowrap"} items-center justify-between gap-[14px] px-4 py-5 tablet:px-6 tablet:py-5 desktop:px-12`}
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">메이트들의 PICK! &#127828;</p>
          {status === "host" ? (
            <p className="text-xs">메이트들이 선택한 맛집에서 즐거운 한끼 어떠세요? </p>
          ) : (
            <div className="flex-none tablet:flex">
              <p className="text-xs">메이트들이 선택한 맛집에서&nbsp;</p>
              <p className="text-xs">즐거운 한끼 어떠세요?</p>
            </div>
          )}
        </div>

        {status === "join" && (
          <Button
            className="h-11 w-[115px] bg-yellow-primary text-[#262626] tablet:grow-0"
            onClick={handleJoin}
          >
            참여하기
          </Button>
        )}

        {status === "cancelJoin" && (
          <Button
            className="h-11 w-[115px] bg-[#ff9e48] !p-[10px] text-white tablet:grow-0"
            onClick={handleLeave}
          >
            참여 취소하기
          </Button>
        )}

        {status === "closed" && (
          <Button className="h-11 w-[115px] bg-[#9CA3AF] text-white tablet:grow-0" disabled>
            참여 마감
          </Button>
        )}

        {status === "host" && (
          <div className="flex w-full gap-2 tablet:w-[238px]">
            <Button
              className="h-11 w-[115px] grow bg-[#E5E7EB] text-[#262626] tablet:w-[115px] tablet:grow-0"
              onClick={handleCancel}
            >
              취소하기
            </Button>
            <Button
              className="h-11 w-[115px] grow bg-yellow-primary text-[#262626] tablet:w-[115px] tablet:grow-0"
              onClick={toggleEditModal}
            >
              수정하기
            </Button>
          </div>
        )}

        {/* 임시로 상태만 보여줌 */}
        {status === "canceled" && <div>취소된 모임</div>}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CancelGathering, LeaveGathering, joinGathering } from "@/apis/assignGatheringApi";
import Button from "@/components/Button/Button";
import useUserStore from "@/store/userStore";
import { GatheringDetailRes } from "@/types/api/gatheringApi";

type FixedBottomBarProps = {
  data: GatheringDetailRes;
  gatheringId: number;
  toggleEditModal: () => void;
  onShowToast: (message: string, type: "success" | "error" | "notification") => void;
};

export default function FixedBottomBar({
  data,
  gatheringId,
  toggleEditModal,
  onShowToast,
}: FixedBottomBarProps) {
  const [status, setStatus] = useState<
  "join" | "cancelJoin" | "closed" | "host" | "canceled" | "loading"
  >("loading");

  const userInfo = useUserStore();
  const router = useRouter();

  const isParticipating = useMemo(
    () => data.participants.some(participant => participant.userId === userInfo.id),
    [data.participants, userInfo.id],
  );

  const determineStatus = useCallback(() => {
    if (data.canceledAt) {
      return setStatus("canceled");
    }

    if (new Date(data.registrationEnd) <= new Date() || data.status === "RECRUITMENT_COMPLETED") {
      return setStatus("closed");
    }

    if (data.host || data.user.id === userInfo.id) {
      return setStatus("host");
    }

    if (data.status === "RECRUITING") {
      return setStatus(isParticipating ? "cancelJoin" : "join");
    }
  }, [isParticipating, data, userInfo.id]);

  useEffect(() => {
    determineStatus();
  }, [determineStatus]);

  function handleApiError<T extends object>(
    response: T | { code?: string; message?: string },
  ): boolean {
    if ("code" in response && response.code) {
      const errorMessage = response.message ?? "예기치 않은 오류가 발생했습니다.";
      console.error("HTTP Error:", errorMessage);
      onShowToast(errorMessage, "error");
      return true;
    }
    return false;
  }

  const handleJoin = async () => {
    if (!userInfo.id) return router.push("/signin");

    try {
      const response = await joinGathering(gatheringId);
      if (handleApiError(response)) return;

      onShowToast("모임에 참여되었습니다.", "success");
      setStatus("cancelJoin");
    } catch (err) {
      console.error("Failed to join gathering:", err);
      onShowToast("예기치 않은 오류가 발생했습니다. 다시 시도해주시기 바랍니다.", "error");
    }
  };

  const handleLeave = async () => {
    if (!userInfo.id) return router.push("/signin");

    try {
      const response = await LeaveGathering(gatheringId);
      if (handleApiError(response)) return;

      onShowToast("모임 참여가 취소되었습니다.", "success");
      setStatus("join");
    } catch (err) {
      console.error("Failed to leave gathering:", err);
      onShowToast("예기치 않은 오류가 발생했습니다. 다시 시도해주시기 바랍니다.", "error");
    }
  };

  const handleCancel = async () => {
    if (!userInfo.id) return router.push("/signin");

    try {
      if (confirm("모임을 취소하시겠습니까?")) {
        const response = await CancelGathering(gatheringId);
        if (handleApiError(response)) return;

        onShowToast("모임이 취소되었습니다.", "success");
        setStatus("canceled");
        router.replace("/");
      }
    } catch (err) {
      console.error("Failed to cancel gathering:", err);
      onShowToast("예기치 않은 오류가 발생했습니다. 다시 시도해주시기 바랍니다.", "error");
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
            참여 취소
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

        {status === "closed" && (
          <Button className="h-11 w-[115px] bg-[#9CA3AF] text-white tablet:grow-0" disabled>
            모임 마감
          </Button>
        )}

        {status === "canceled" && (
          <Button className="h-11 w-[124px] bg-[#9CA3AF] text-white tablet:grow-0" disabled>
            취소된 모임
          </Button>
        )}
      </div>
    </div>
  );
}

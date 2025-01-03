import Image from "next/image";
import { LeaveGathering } from "@/apis/assignGatheringApi";
import Button from "@/components/Button/Button";
import Chip from "@/components/Chips";
import useToastStore from "@/store/useToastStore";
import { MypageCardProps } from "@/types/components/card";
import { formatToKoreanTime } from "@/utils/date";
import Toast from "../Toast";

export default function MypageCard({
  id,
  name,
  location,
  address1,
  dateTime,
  image,
  participantCount,
  capacity,
  canceledAt,
}: MypageCardProps) {
  const isDateTime = dateTime;
  const dateString = "MM월 dd일";
  const timeString = "HH:mm";
  const gatheringDate = formatToKoreanTime(isDateTime, dateString);
  const gatheringTime = formatToKoreanTime(isDateTime, timeString);
  const isPast = new Date(dateTime) < new Date(); // 모임 시간과 현재 시간 비교
  const addToast = useToastStore(state => state.addToast);

  const handleLeaveGathering = async () => {
    if (id) {
      try {
        await LeaveGathering(id);
        addToast({ message: "모임이 취소되었습니다.", type: "success" });
        window.location.reload();
      } catch (error) {
        addToast({ message: "모임 취소에 실패했습니다. 다시 시도해 주세요.", type: "error" });
      }
    }
  };

  return (
    <>
      <div className="relative flex w-full flex-col gap-4 tablet:h-[153px] tablet:flex-row">
        {/* 반투명 오버레이 */}
        {(canceledAt || isPast) && (
          <div className="absolute inset-0 z-10 flex h-[340px] flex-col items-center justify-center gap-6 rounded-3xl bg-black bg-opacity-70 tablet:h-[173px]">
            <span className="text-center text-sm font-semibold text-white">
              {canceledAt
                ? "모집 취소된 모임이에요, /n다음 기회에 만나요🙏"
                : "종료된 모임이에요, /n다음 기회에 만나요🙏"}
            </span>
            <button className="flex h-[36px] w-[116px] items-center justify-center gap-0.5 rounded-xl bg-[#FFF7ED]">
              <Image src="/images/bye.svg" width={24} height={24} alt="bye 이모지" />
              <span className="text-xs text-[#FF9E48]">모임 보내주기</span>
            </button>
          </div>
        )}
        <div className="relative flex h-[153px] w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl tablet:w-[280px]">
          <Image src={image} fill objectFit="cover" alt="모임 이미지" />
        </div>
        <div className="flex w-full flex-col">
          <div className="mb-3 flex gap-2">
            <Chip
              type="state"
              bgColor="bg-orange-100"
              textColor="text-orange-primary"
              className="flex items-center justify-center"
            >
              이용 예정
            </Chip>
            <Chip
              type="state"
              textColor={participantCount >= 3 ? "text-orange-primary" : "text-gray-400"}
              bgColor={"bg-transparent"}
              className={`flex items-center justify-center outline outline-[1px] ${participantCount >= 3 ? "outline-orange-100" : "outline-gray-200"}`}
            >
              {participantCount >= 3 ? "개설확정" : "개설대기"}
            </Chip>
          </div>
          <div className="flex gap-3">
            <div className="mb-[18px] flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <span className="inline-block">{name}</span>
                <span className="inline-block">|</span>
                <span className="text-#3C3C3C inline-block text-sm">
                  &nbsp;{`${location} ${address1}`}
                </span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-#3C3C3C flex gap-3 text-sm">{`${gatheringDate} · ${gatheringTime}`}</span>
                <span className="flex gap-0.5">
                  <Image
                    src="/icons/person.svg"
                    width={16}
                    height={16}
                    alt="참여 인원"
                    className="inline-block"
                  />
                  <span className="inline-block text-sm">{`${participantCount}/${capacity}`}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-[120px]">
              <Button
                size="small"
                isFilled
                onClick={() => {
                  handleLeaveGathering();
                }}
                className="border border-orange-primary px-0 text-[14px] text-orange-primary"
              >
                예약 취소하기
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
}

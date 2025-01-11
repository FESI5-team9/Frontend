"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import useClickOutside from "@/hooks/useClickOutside";
import FavoriteButton from "@/components/Button/FavoriteButton";
import Chip from "@/components/Chips";
import Progressbar from "@/components/Progressbar";
import { GatheringDetailRes } from "@/types/api/gatheringApi";
import { formatToKoreanTime } from "@/utils/date";

type GatheringProp = {
  gathering: GatheringDetailRes;
};

export default function DetailCard({ gathering }: GatheringProp) {
  const [isParticipantsListOpen, setIsParticipantsListOpen] = useState<boolean>(false);

  const popupRef = useRef<HTMLDivElement | null>(null);

  const date = formatToKoreanTime(gathering.dateTime, "MM월 d일");
  const time = formatToKoreanTime(gathering.dateTime, "HH:mm");

  const toggleParticipantsList = () => setIsParticipantsListOpen(prev => !prev);
  const closeParticipantsList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isParticipantsListOpen) setIsParticipantsListOpen(false);
  };

  useClickOutside(popupRef, () => setIsParticipantsListOpen(false));

  return (
    <div className="flex flex-col rounded-3xl border-2 border-[#e5e7eb] bg-white px-6 py-[14px] tablet:p-6">
      <div className="flex flex-col justify-between border-b-2 border-dashed border-[#E5E7EB]">
        <div className="flex w-full items-start justify-between">
          <div className="flex max-w-[360px] flex-col gap-1">
            <h1 className="text-lg font-semibold">{gathering.name}</h1>
            <p className="text-sm text-[#3C3C3C]">{gathering.address2}</p>
            <div className="mt-1 flex gap-2">
              <Chip
                className="inline-flex"
                fontSize="text-xs"
                bgColor="bg-black"
                textColor="text-white"
                type="default"
              >
                {date}
              </Chip>
              <Chip
                className="inline-flex"
                fontSize="text-xs"
                bgColor="bg-black"
                textColor="text-yellow-primary"
                type="default"
              >
                {time}
              </Chip>
            </div>
          </div>
          <FavoriteButton gatheringId={gathering.id} initialFavorite={gathering.favorite} />
        </div>

        <div className="my-[10px] flex flex-wrap items-center gap-1">
          {gathering.keyword.map((word, index) => (
            <div className="rounded bg-[#FFFACD] px-1 py-[2px] text-sm" key={index}>
              {word}
            </div>
          ))}
        </div>
      </div>

      <div
        onClick={toggleParticipantsList}
        ref={popupRef}
        className="flex w-full grow flex-col justify-end gap-[10px] pt-3"
      >
        <div className="relative flex cursor-pointer items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm font-semibold">모집 정원 {gathering.participantCount}명</p>

            <div className="ml-4 flex">
              {gathering.participants.map(
                (person, index) =>
                  index < 4 && (
                    <div
                      key={index}
                      className="-ml-3 h-[29px] w-[29px] cursor-pointer rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${person.image || "/images/lemonProfile.svg"})`,
                      }}
                    ></div>
                  ),
              )}
              {gathering.participantCount > 4 ? (
                <div className="-ml-3 flex h-[29px] w-[29px] select-none items-center justify-center rounded-full bg-[#f2f4f5] text-sm font-semibold text-[#262626]">
                  +{gathering.participantCount - 4}
                </div>
              ) : null}
              {isParticipantsListOpen && (
                <div
                  onClick={e => e.stopPropagation()}
                  className="z-2 absolute left-0 top-9 flex min-w-[200px] cursor-default flex-col items-center justify-between rounded-2xl border bg-white p-4"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="h-4 w-4"></div>
                    <h3 className="text-sm font-semibold">참석자 목록</h3>
                    <button
                      onClick={closeParticipantsList}
                      className="h-[14px] w-[14px]"
                      type="button"
                    >
                      <Image src="/icons/X.svg" width={14} height={14} alt="닫기" />
                    </button>
                  </div>

                  {gathering.participants.map(person => (
                    <div className="mt-2 flex w-full items-center gap-2" key={person.userId}>
                      <div
                        className="h-[24px] w-[24px] rounded-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${person.image || "/images/lemonProfile.svg"})`,
                        }}
                      ></div>
                      <p className="text-sm font-semibold"> {person.nickname}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {gathering.open && (
            <div className="flex gap-1">
              <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black">
                <Image
                  style={{
                    width: "12px",
                    height: "12px",
                  }}
                  src="/images/detailPage/checked.svg"
                  width={12}
                  height={12}
                  alt="개설 확정"
                />
              </div>
              <p className="text-sm">개설확정</p>
            </div>
          )}
        </div>
        <div>
          <Progressbar now={gathering.participantCount} max={gathering.capacity} />
        </div>
        <div className="flex items-center justify-between text-xs text-[#3C3C3C]">
          <p>최소인원 {gathering.openParticipantCount}명</p>
          <p>최대인원 {gathering.capacity}명</p>
        </div>
      </div>
    </div>
  );
}

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
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const popupRef = useRef<HTMLDivElement | null>(null);

  const date = formatToKoreanTime(gathering.dateTime, "MM월 d일");
  const time = formatToKoreanTime(gathering.dateTime, "HH:mm");

  const closeParticipantsList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isOpen) setIsOpen(false);
  };

  useClickOutside(popupRef, () => setIsOpen(false));

  return (
    <div className="flex flex-col rounded-3xl border-2 border-[#e5e7eb] bg-white px-6 py-[14px] tablet:p-6">
      <div className="flex flex-col justify-between border-b-2 border-dashed border-[#E5E7EB]">
        <div className="flex w-full items-start justify-between">
          <div className="flex max-w-[360px] flex-col gap-1">
            <p className="text-lg font-semibold">{gathering.name}</p>
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

      <div className="flex w-full grow flex-col justify-end gap-[10px] pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm font-semibold">모집 정원 {gathering.participantCount}명</p>

            <div onClick={() => setIsOpen(true)} className="relative ml-4 flex">
              {gathering.participants.map(
                (person, index) =>
                  index < 4 && (
                    <div
                      key={index}
                      className="-ml-3 h-[29px] w-[29px] cursor-pointer rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${person.image ? person.image : "/images/profile.svg"})`,
                      }}
                    ></div>
                  ),
              )}
              {gathering.participantCount > 4 ? (
                <div className="-ml-3 flex h-[29px] w-[29px] select-none items-center justify-center rounded-full bg-[#f2f4f5] text-sm font-semibold text-[#262626]">
                  +{gathering.participantCount - 4}
                </div>
              ) : null}
              {isOpen && (
                <div
                  ref={popupRef}
                  className="absolute -left-3 top-9 flex min-w-[200px] flex-col items-center justify-between rounded-2xl border bg-white p-4"
                >
                  <h3 className="mb-3 border-b-2 border-gray-100 text-center font-semibold">
                    참석자 목록
                  </h3>
                  {gathering.participants.map(person => (
                    <div className="mt-2 flex w-full items-center gap-2" key={person.userId}>
                      <div
                        className="h-[24px] w-[24px] rounded-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${person.image ? person.image : "/images/profile.svg"})`,
                        }}
                      ></div>
                      <p className="text-sm font-semibold"> {person.nickname}</p>
                    </div>
                  ))}
                  <button
                    onClick={closeParticipantsList}
                    className="mt-6 h-[32px] rounded-xl bg-[#dfe0e1] px-4 text-sm font-semibold"
                    type="button"
                  >
                    닫기
                  </button>
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

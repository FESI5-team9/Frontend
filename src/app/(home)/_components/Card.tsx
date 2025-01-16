import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/Button/FavoriteButton";
import Chip from "@/components/Chips";
import Progressbar from "@/components/Progressbar";
import { GetGathering } from "@/types/components/card";
import { formatToOriginTime, getRemainingOriginHours } from "@/utils/date";
import ButtonJoin from "./ButtonJoin";
import { ResizedImage } from "./ResizedImage";

export default function Card({
  cardData,
  onUpdate,
}: {
  cardData: GetGathering;
  onUpdate: () => void;
}) {
  return (
    <div
      className="relative flex w-full transform flex-col rounded-2xl border-y-2 border-gray-200 bg-white transition-transform duration-200 hover:shadow-xl tablet:h-[156px] tablet:w-full tablet:flex-row"
      data-testid="card"
    >
      {/* 카드 내용 */}
      <Link prefetch={false} href={`groupDetail/${cardData.id}`} className="relative flex">
        <div className="relative w-full max-w-full rounded-2xl tablet:h-[153px] tablet:w-[272px] tablet:rounded-l-2xl">
          <ResizedImage
            src={cardData.image}
            alt={`${cardData.name}`}
            width={544}
            height={306}
            format="webp"
            placeholder="blur"
            priority
            fetchPriority="high"
          />
        </div>
        <div className="absolute right-0 top-0 flex flex-row items-center gap-1 rounded-xl border border-none bg-yellow-primary px-2 py-1 tablet:rounded-bl-xl">
          <Image
            src="/images/mainPage/alarm.svg"
            width={20}
            height={16}
            alt="alarm"
            style={{ width: "auto", height: "auto" }}
          />
          <p>{getRemainingOriginHours(cardData.registrationEnd) || "날짜 없음"}</p>
        </div>
      </Link>
      {/* 모임 종료된 경우 */}
      {cardData.canceledAt && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-2xl bg-black bg-opacity-70 text-lg font-semibold text-white">
          <p>이미 종료된 모임이에요.</p>
          <p>다음 기회에 만나요!</p>
        </div>
      )}

      <div className="flex w-full flex-col justify-between p-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <Link
                prefetch={false}
                href={`groupDetail/${cardData.id}`}
                className="text-lg hover:underline"
              >
                {cardData.name}
              </Link>
              <p className="border-l-2 px-2 text-sm">{cardData.address1}</p>
            </div>
            <div className="flex flex-row gap-2">
              <Chip type="default" bgColor="bg-black" textColor="text-white">
                {formatToOriginTime(cardData.dateTime, "MM월 dd일") || "날짜 없음"}
              </Chip>
              <Chip type="default" bgColor="bg-black" textColor="text-yellow-primary">
                {formatToOriginTime(cardData.dateTime, "HH시 mm분") || "날짜 없음"}
              </Chip>
            </div>
          </div>
          <FavoriteButton gatheringId={cardData.id} initialFavorite={cardData.favorite} />
        </div>
        <div className="flex items-end justify-between">
          <div className="mt-4 flex w-3/5 flex-col gap-2 tablet:w-3/5 desktop:w-3/5">
            <div className="flex flex-row gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="relative h-[16px] w-[16px]">
                  <Image src="/images/mainPage/card/people.svg" alt="people" fill />
                </div>
                <p>
                  {cardData.participantCount} / {cardData.capacity}
                </p>
              </div>
              {cardData.open && (
                <div className="flex gap-1">
                  <Image
                    src="/images/mainPage/card/ic_check.svg"
                    width={24}
                    height={24}
                    alt="check"
                  />
                  <div>개설확정</div>
                </div>
              )}
            </div>
            <Progressbar now={cardData.participantCount} max={cardData.capacity} />
          </div>
          <ButtonJoin id={cardData.id} participation={cardData.participation} onUpdate={onUpdate} />
        </div>
      </div>
    </div>
  );
}

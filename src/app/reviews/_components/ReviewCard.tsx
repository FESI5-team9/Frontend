import Image from "next/image";
import { ReviewsRes } from "@/types/api/reviews";
import { formatToKoreanTime } from "@/utils/date";

const Heart = ({ filled = false, size = 20, color = "#FFD700", emptyColor = "#E0E0E0" }) => {
  return (
    <span
      style={{
        color: filled ? color : emptyColor,
        fontSize: `${size}px`,
        margin: "0 2px",
      }}
    >
      ♥
    </span>
  );
};

const Rating = ({ score }: { score: number }) => {
  // 1부터 5까지의 하트를 만들기 위한 배열
  const hearts = [];
  for (let i = 1; i <= 5; i++) {
    hearts.push(<Heart key={i} size={24} filled={i <= score} />);
  }

  return <div>{hearts}</div>;
};

export default function AllReviewCard({ reviews }: { reviews: ReviewsRes }) {
  return (
    <div>
      {reviews && // map에서 사용
        reviews?.map(item => (
          <div
            key={item.id}
            className="flex h-[348px] w-full flex-col gap-6 tablet:mb-6 tablet:h-[153px] tablet:flex-row"
          >
            <div className="relative flex h-[153px] w-[272px] max-w-[272px] items-center justify-center overflow-hidden rounded-3xl">
              <Image
                src={
                  typeof item.gathering.image === "string"
                    ? item.gathering.image
                    : "/images/image.png"
                }
                fill
                alt="이미지"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div>
                <Rating score={item.score} />
              </div>
              <p className="mt-[10px] h-[34px] w-full break-words text-sm text-gray-800">
                {item.comment}
              </p>
              <span className="mt-[10px] inline-block text-xs text-gray-800">
                {`${item.gathering.name} · ${item.gathering.location}`}
              </span>
              <div className="mt-2 flex items-center">
                <div className="relative mr-2 h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={item.user.image || "/images/default-profile.svg"}
                    fill
                    alt="프로필 이미지"
                  />
                </div>
                <span className="inline-block text-xs text-gray-700">{item.user.nickname}</span>
                <span className="ml-2 mr-3 inline-block">|</span>
                <span className="inline-block text-xs text-gray-disable">
                  {item.gathering.dateTime
                    ? formatToKoreanTime(item.gathering.dateTime as string, "yyyy.MM.dd")
                    : "날짜 정보 없음"}
                </span>
              </div>
              <div className="mb-6 mt-4 w-full border border-dashed border-b-gray-disable tablet:mb-0 tablet:mt-auto"></div>
            </div>
          </div>
        ))}
    </div>
  );
}

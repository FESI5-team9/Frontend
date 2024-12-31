import Image from "next/image";
import Progressbar from "@/components/Progressbar";
import { ReviewRating } from "@/types/api/reviews";

export default function ReviewRatingComponent({
  ratingData,
  totalReviews,
}: {
  ratingData: ReviewRating;
  totalReviews: number;
}) {
  const emptyRatingData = {
    averageScore: 0,
    oneStar: 0,
    twoStars: 0,
    threeStars: 0,
    fourStars: 0,
    fiveStars: 0,
  };

  const ratingScores = ratingData || emptyRatingData;

  const ScoreProgressBar = (label: string, value: number) => (
    <div className="flex w-full items-center gap-[10px]">
      <span className="text-sm font-medium">{label}</span>
      <div className="grow">
        <Progressbar now={value} max={totalReviews} />
      </div>
      <span className="text-sm font-medium text-[#9ca3af]">{value}</span>
    </div>
  );

  return (
    <div className="flex h-[180px] w-full items-center justify-center gap-5 tablet:gap-[120px]">
      <div className="flex max-w-[128px] flex-col items-center justify-center text-2xl font-semibold">
        <div>
          <span className="mr-[2px]">{ratingScores?.averageScore.toFixed(1)}</span>
          <span className="text-[#9CA3AF]">/5</span>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex h-6 w-6 items-center justify-center">
              <Image
                width={24}
                height={22}
                alt="평점"
                src={
                  index < ratingScores?.averageScore
                    ? "/images/heart/filled_heart.svg"
                    : "/images/heart/grey_heart.svg"
                }
                style={{ width: "24px", height: "22px" }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full max-w-[294px] flex-col">
        {ScoreProgressBar("5점", ratingScores?.fiveStars)}
        {ScoreProgressBar("4점", ratingScores?.fourStars)}
        {ScoreProgressBar("3점", ratingScores?.threeStars)}
        {ScoreProgressBar("2점", ratingScores?.twoStars)}
        {ScoreProgressBar("1점", ratingScores?.oneStar)}
      </div>
    </div>
  );
}

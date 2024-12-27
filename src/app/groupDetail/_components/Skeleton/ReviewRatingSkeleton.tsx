import Image from "next/image";
import Progressbar from "@/components/Progressbar";

const ScoreProgressBar = (label: string, value: number) => (
  <div className="flex w-full items-center gap-[10px]">
    <span className="text-sm font-medium">{label}</span>
    <div className="grow">
      <Progressbar now={0} max={0} />
    </div>
    <span className="text-sm font-medium text-[#9ca3af]">{value}</span>
  </div>
);

export default function ReviewRatingSkeleton() {
  return (
    <div className="flex h-[180px] w-full items-center justify-center gap-5 tablet:gap-[120px]">
      <div className="flex max-w-[128px] flex-col items-center justify-center text-2xl font-semibold">
        <div>
          <span className="mr-[2px]">0.0</span>
          <span className="text-[#9CA3AF]">/5</span>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex h-6 w-6 items-center justify-center">
              <Image
                width={24}
                height={22}
                alt="평점"
                src="/images/heart/grey_heart.svg"
                style={{ width: "24px", height: "22px" }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full max-w-[294px] flex-col">
        {ScoreProgressBar("5점", 0)}
        {ScoreProgressBar("4점", 0)}
        {ScoreProgressBar("3점", 0)}
        {ScoreProgressBar("2점", 0)}
        {ScoreProgressBar("1점", 0)}
      </div>
    </div>
  );
}

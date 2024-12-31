import Image from "next/image";
import { getRemainingOriginHours } from "@/utils/date";

export default function ClosingTimeTag({
  deadline,
  className = "",
}: {
  deadline: string;
  className?: string;
}) {
  return (
    <div
      className={`z-2 absolute right-0 top-0 flex h-[32px] min-w-[123px] items-center justify-center gap-[8px] rounded-bl-3xl bg-yellow-primary ${className}`}
    >
      <Image src="/images/mainPage/alarm.svg" width={15} height={13} alt="남은 마감시간" />
      <p className="text-xs">{getRemainingOriginHours(deadline)}</p>
    </div>
  );
}

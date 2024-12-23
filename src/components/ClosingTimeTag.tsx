import { useEffect, useState } from "react";
import Image from "next/image";
import { getTimeDiff } from "@/utils/date";

export default function ClosingTimeTag({
  deadline,
  className = "",
}: {
  deadline: string;
  className?: string;
}) {
  const [closingTime, setClosingTime] = useState<string>("");

  useEffect(() => {
    const timeDiff = getTimeDiff(deadline);

    if (!timeDiff) return;

    const { diffMinutes, diffHours, diffDays } = timeDiff;

    let displayTime = "";

    if (diffDays >= 1 && diffDays <= 60) {
      displayTime = `${diffDays}일 후 마감`;
    } else if (diffHours >= 1) {
      displayTime = `${diffHours}시간 후 마감`;
    } else if (diffMinutes >= 0) {
      displayTime = `${diffMinutes}분 후 마감`;
    }

    setClosingTime(displayTime);
  }, [deadline]);

  if (!closingTime) return null;

  return (
    <div
      className={`absolute right-0 top-0 z-50 flex h-[32px] min-w-[123px] items-center justify-center gap-[8px] rounded-bl-3xl bg-yellow-primary ${className}`}
    >
      <Image src="/images/mainPage/alarm.svg" width={15} height={13} alt="남은 마감시간" />
      <p className="text-xs">{closingTime}</p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { DAYS_OF_WEEK, MONTH_OF_YEAR } from "@/constants/calendar";
import useDateStore from "@/store/dateStore";

function DateCell({
  date,
  type,
  today,
  currentDate,
  firstDate,
  secondDate,
  onSelectDate,
  onNavigateToPrevMonth,
  onNavigateToNextMonth,
}: DateCellProps) {
  const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

  const todayKST = new Date(today.getTime() + 9 * 60 * 60 * 1000); // KST 기준으로 보정
  const isToday = type === "current" && todayKST.toISOString().slice(0, 10) === selectedDate;

  const isFirstDate = type === "current" && firstDate && firstDate.slice(0, 10) === selectedDate;

  const isSecondDate = type === "current" && secondDate && secondDate.slice(0, 10) === selectedDate;
  const handleClick = {
    current: onSelectDate,
    prev: onNavigateToPrevMonth,
    next: onNavigateToNextMonth,
  }[type];

  return (
    <td onClick={handleClick} className="flex h-8 w-9 cursor-pointer text-center">
      <span
        className={`flex h-full w-full select-none items-center justify-center rounded-[8px] ${
          type === "prev" || type === "next" ? "text-gray-500" : ""
        } ${isFirstDate ? "bg-yellow-primary text-white" : ""} ${
          isSecondDate ? "bg-[#FF9E48] text-white" : ""
        }${isToday && !isFirstDate ? "text-[#FF9E48]" : ""} `}
      >
        {date}
      </span>
    </td>
  );
}

export default function Calendar({ selectMode, multipleDates }: CalendarProps) {
  const { firstDate, secondDate, setFirstDate, setSecondDate } = useDateStore();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDayOfMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const lastDayOfMonth = useMemo(() => new Date(year, month + 1, 0), [year, month]);
  const lastDayOfPrevMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);

  const leadingEmptyDays = firstDayOfMonth.getDay();
  const trailingEmptyDays = 6 - lastDayOfMonth.getDay();

  const prevMonthDates = useMemo(
    () =>
      Array.from(
        { length: leadingEmptyDays },
        (_, i) => lastDayOfPrevMonth - leadingEmptyDays + i + 1,
      ),
    [lastDayOfPrevMonth, leadingEmptyDays],
  );

  const nextMonthDates = useMemo(
    () => Array.from({ length: trailingEmptyDays }, (_, i) => i + 1),
    [trailingEmptyDays],
  );

  const dates = useMemo(
    () => Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1),
    [lastDayOfMonth],
  );

  const allDates = useMemo(
    () => [
      ...prevMonthDates.map(date => ({ date, type: "prev" })),
      ...dates.map(date => ({ date, type: "current" })),
      ...nextMonthDates.map(date => ({ date, type: "next" })),
    ],
    [prevMonthDates, dates, nextMonthDates],
  );

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSelectedDate = (date: number) => {
    const newDate = new Date(currentDate);

    newDate.setDate(date);
    newDate.setHours(0, 0, 0, 0);

    // UTC 시간 기준에서 +9시간(KST)으로 변환
    const kstDate = new Date(newDate.getTime() + 9 * 60 * 60 * 1000);
    const formattedDate = kstDate.toISOString().slice(0, 10);

    if (firstDate && !secondDate && firstDate === formattedDate) {
      return setFirstDate(null);
    }

    if (!multipleDates) {
      setFirstDate(formattedDate);
    }

    if (!selectMode && multipleDates) {
      if (!secondDate && firstDate) {
        if (formattedDate > firstDate) {
          setSecondDate(formattedDate);
        } else {
          setSecondDate(firstDate);
          setFirstDate(formattedDate);
        }
      } else if (firstDate && secondDate) {
        setFirstDate(formattedDate);
        setSecondDate(null);
      } else if (!firstDate && !secondDate) {
        setFirstDate(formattedDate);
      }
    }

    if (selectMode && selectMode === "first") {
      setFirstDate(formattedDate);
    } else if (selectMode && selectMode === "second") {
      setSecondDate(formattedDate);
    }
  };

  return (
    <div className="flex w-[280px] flex-col items-center justify-center rounded-[12px] bg-white py-3">
      <div className="mb-1 flex h-8 w-[250px] items-center justify-between">
        <button type="button" onClick={handlePrevMonth}>
          <Image
            className="rotate-180"
            src="/images/ic_arrow.png"
            alt="prev month"
            width={24}
            height={24}
          />
        </button>
        <div className="flex gap-1">
          <span>{MONTH_OF_YEAR[month]}</span>
          <span>{year}</span>
        </div>
        <button type="button" onClick={handleNextMonth}>
          <Image src="/images/ic_arrow.png" alt="next month" width={24} height={24} />
        </button>
      </div>

      <table className="w-[250px] table-fixed">
        <thead>
          <tr className="flex w-[250px] justify-between">
            {DAYS_OF_WEEK.map(day => (
              <th className="h-8 w-9 select-none text-center" key={day}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="flex w-[250px] flex-col justify-between">
          {Array.from({ length: Math.ceil(allDates.length / 7) }).map((_, rowIndex) => (
            <tr className="flex w-[250px] justify-between" key={rowIndex}>
              {allDates.slice(rowIndex * 7, rowIndex * 7 + 7).map(({ date, type }, colIndex) => (
                <DateCell
                  key={colIndex}
                  date={date}
                  type={type}
                  today={today}
                  currentDate={currentDate}
                  firstDate={firstDate}
                  secondDate={secondDate}
                  onSelectDate={() => handleSelectedDate(date)}
                  onNavigateToPrevMonth={handlePrevMonth}
                  onNavigateToNextMonth={handleNextMonth}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

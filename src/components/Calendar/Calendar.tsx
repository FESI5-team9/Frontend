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
  const isFirstDate = type === "current" && firstDate && firstDate.slice(0, 10) === selectedDate;
  const isSecondDate = type === "current" && secondDate && secondDate.slice(0, 10) === selectedDate;

  const isPastDay =
    type === "current" && new Date(currentDate.getFullYear(), currentDate.getMonth(), date) < today;

  const isInRange =
    type === "current" &&
    firstDate &&
    secondDate &&
    new Date(firstDate) < new Date(selectedDate) &&
    new Date(selectedDate) < new Date(secondDate);

  const handleClick = isPastDay
    ? undefined
    : {
      current: onSelectDate,
      prev: onNavigateToPrevMonth,
      next: onNavigateToNextMonth,
    }[type];

  return (
    <td
      role="gridcell"
      aria-selected={isFirstDate || isSecondDate ? "true" : "false"}
      aria-disabled={isPastDay ? "true" : undefined}
      tabIndex={isPastDay ? -1 : 0}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === "Enter" && !isPastDay) {
          handleClick?.();
        }
      }}
      className="flex h-8 w-9 cursor-pointer text-center"
    >
      <span
        className={`flex h-full w-full select-none items-center justify-center rounded-[8px] ${isFirstDate && "bg-yellow-primary"} ${isSecondDate && "bg-[#FF9E48]"} ${(type === "prev" || type === "next" || isPastDay) && "text-gray-300"} ${isInRange && "bg-gray-200"} `}
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
  today.setHours(0, 0, 0, 0);

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
        <button aria-label="이전 달로 이동" type="button" onClick={handlePrevMonth}>
          <Image
            className="rotate-180"
            src="/images/ic_arrow.png"
            alt="prev month"
            width={24}
            height={24}
            style={{ height: "auto" }}
          />
        </button>
        <div className="flex gap-1">
          <span>{MONTH_OF_YEAR[month]}</span>
          <span>{year}</span>
        </div>
        <button aria-label="다음 달로 이동" type="button" onClick={handleNextMonth}>
          <Image src="/images/ic_arrow.png" alt="next month" width={24} height={24} />
        </button>
      </div>

      <table role="grid" aria-label={`${year}년 ${month + 1}월`} className="w-[250px] table-fixed">
        <thead>
          <tr role="row" className="flex w-[250px] justify-between">
            {DAYS_OF_WEEK.map(day => (
              <th role="columnheader" className="h-8 w-9 select-none text-center" key={day}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="flex w-[250px] flex-col justify-between">
          {Array.from({ length: Math.ceil(allDates.length / 7) }).map((_, rowIndex) => (
            <tr role="row" className="flex w-[250px] justify-between" key={rowIndex}>
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

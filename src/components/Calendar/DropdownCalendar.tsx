"use client";

import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import useQueryBuilder from "@/hooks/useUrlParams";
import Button from "@/components/Button/Button";
import Calendar from "@/components/Calendar/Calendar";
import FilterButton from "@/components/Filter/FilterButton";
import useDateStore from "@/store/dateStore";

export default function DropdownCalendar() {
  const { setFirstDate, setSecondDate, firstDate, secondDate } = useDateStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const updateQueryParams = useQueryBuilder(); // URL 파라미터 업데이트 훅

  const [submittedDateOption, setSummitedDateOption] = useState<{
    firstDate: string;
    secondDate: string;
  } | null>(null);

  // 드롭다운 열고 닫기
  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

  // 드롭다운 닫기 (외부 클릭)
  const resetAndCloseDropdown = () => {
    if (isOpen) setIsOpen(false);
  };

  useClickOutside(dropdownRef, resetAndCloseDropdown);

  // 날짜 초기화
  const resetDate = () => {
    setFirstDate(null);
    setSecondDate(null);
    updateQueryParams({ startDate: "", endDate: "" }); // 빈 문자열로 파라미터 제거
    setSummitedDateOption(null);
    setIsOpen(false);
  };

  // URL 파라미터 업데이트
  const submitDates = () => {
    if (firstDate) {
      const queryParams: { startDate: string; endDate: string } = {
        startDate: firstDate || "", // 값 없으면 빈 문자열
        endDate: secondDate || firstDate || "", // 값 없으면 빈 문자열
      };

      // URL에 반영
      updateQueryParams(queryParams);

      setSummitedDateOption({
        firstDate: firstDate ? firstDate.split("-").slice(1).join(".") : "",
        secondDate: secondDate ? secondDate.split("-").slice(1).join(".") : "",
      });

      // 드롭다운 닫기
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <FilterButton
        selectedDateOption={submittedDateOption}
        filterType="calendarFilter"
        onToggle={toggleDropdown}
        isOpen={isOpen}
      />

      <div
        className={`fixed left-1/2 top-1/2 z-50 mt-3 flex w-[300px] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-[12px] border-[2px] border-[#F3F4F6] bg-white tablet:absolute tablet:left-0 tablet:top-[36px] tablet:translate-x-0 tablet:translate-y-0 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {/* 캘린더는 상태 변경 시 자동으로 업데이트 */}
        <Calendar multipleDates={true} />
        <div className="mb-3 flex w-full justify-around px-3">
          <Button
            aria-label="날짜 선택 초기화"
            onClick={resetDate}
            size="small"
            className="w-[118px] bg-[#F3F4F6] font-semibold"
          >
            초기화
          </Button>
          <Button
            aria-label="선택한 날짜 적용"
            onClick={submitDates}
            size="small"
            className="w-[118px] bg-yellow-primary font-semibold"
          >
            적용
          </Button>
        </div>
      </div>
    </div>
  );
}

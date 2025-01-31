import Image from "next/image";

export default function FilterButton({
  selectedDateOption,
  selectedOption,
  filterType,
  onToggle,
  isOpen,
}: FilterButtonProps) {
  const labelText =
    filterType === "calendarFilter"
      ? selectedDateOption
        ? `${selectedDateOption.firstDate} - ${selectedDateOption.secondDate || selectedDateOption.firstDate}`
        : "날짜 선택"
      : selectedOption?.ko;

  return (
    <div
      role="button"
      aria-haspopup={filterType === "calendarFilter" ? "grid" : "listbox"}
      aria-label={labelText}
      aria-expanded={isOpen}
      onClick={onToggle}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter") {
          onToggle?.();
        }
      }}
      className="cursor-pointer"
    >
      {filterType === "sortFilter" && (
        <div className="relative flex h-[36px] w-[120px] select-none items-center justify-center rounded-[12px] border-[2px] border-[#F3F4F6] bg-white px-[12px] text-sm transition-all hover:bg-[#F3F4F6] tablet:h-[40px]">
          <div className="flex h-6 w-6 items-center">
            <Image
              src="/images/filter/swap_vert.svg"
              alt={filterType}
              width={18}
              height={10}
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <span>{labelText}</span>
        </div>
      )}

      {filterType === "selectionFilter" && (
        <div className="relative flex h-[36px] w-[110px] select-none items-center justify-between rounded-[12px] border-[2px] border-[#F3F4F6] px-[12px] py-[6px] text-sm transition-all hover:bg-[#F3F4F6] tablet:h-[40px] tablet:py-[8px]">
          <div className="flex h-6 w-6 items-center">
            <Image
              src="/images/filter/arrow_drop_down.svg"
              alt={filterType}
              width={22}
              height={22}
            />
          </div>
          <span>{labelText}</span>
        </div>
      )}

      {filterType === "calendarFilter" && (
        <div className="relative flex h-[36px] min-w-[110px] select-none items-center justify-between rounded-[12px] border-[2px] border-[#F3F4F6] px-[10px] py-[6px] text-sm transition-all hover:bg-[#F3F4F6] tablet:h-[40px] tablet:py-[8px]">
          <div className="flex h-6 w-6 items-center">
            <Image
              src="/images/filter/arrow_drop_down.svg"
              alt={filterType}
              width={22}
              height={22}
            />
          </div>
          <span>{labelText}</span>
        </div>
      )}
    </div>
  );
}

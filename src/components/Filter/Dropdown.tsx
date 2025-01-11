export default function Dropdown({
  options,
  isOpen,
  onSelectOption,
  selectedOption,
  filterType,
}: DropdownProps) {
  return (
    <ul
      role="listbox"
      className={`${isOpen ? "block" : "hidden"} ${filterType === "selectionFilter" ? "w-[110px]" : "w-[120px]"} absolute z-50 mt-3 rounded-[12px] border-[2px] border-[#F3F4F6] bg-white p-1`}
    >
      {options.map(option => (
        <li
          role="option"
          aria-selected={selectedOption?.ko === option.ko}
          className="h-[36px] w-full select-none rounded-xl px-[12px] py-[6px] text-sm hover:bg-[#FFFACD] tablet:h-[40px] tablet:py-[8px]"
          onClick={() => onSelectOption(option)}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "Enter") {
              onSelectOption(option);
            }
          }}
          key={option.ko}
        >
          {option.ko}
        </li>
      ))}
    </ul>
  );
}

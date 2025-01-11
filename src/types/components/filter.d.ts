type FilterType = "sortFilter" | "selectionFilter" | "calendarFilter";

type OptionType = { ko: string; eng: string };
type CalendarType = { firstDate?: string; secondDate?: string };

type FilterDropdownProps = {
  filterType: FilterType;
  options: OptionType[];
  onSelectFilterOption: (currentOption: string) => void;
};

type FilterButtonProps = {
  selectedOption?: OptionType;
  selectedDateOption?: CalendarType | null;
  filterType: string;
  onToggle: () => void;
};

type DropdownProps = {
  options: OptionType[];
  isOpen: boolean;
  selectedOption: OptionType;
  onSelectOption: (textContent: OptionType) => void;
  filterType: string;
};

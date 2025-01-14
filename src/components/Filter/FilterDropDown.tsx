"use client";

import { useCallback, useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import Dropdown from "@/components/Filter/Dropdown";
import FilterButton from "@/components/Filter/FilterButton";

export function FilterDropDown({ filterType, options, onSelectFilterOption }: FilterDropdownProps) {
  const [selectedOption, setSelectedOption] = useState<OptionType>(options[0]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOptionSelect = useCallback(
    (option: OptionType) => {
      setSelectedOption(option);
      onSelectFilterOption(option.eng);
      setIsOpen(false);
    },
    [onSelectFilterOption],
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

  const closeDropdown = () => {
    if (isOpen) setIsOpen(false);
  };

  useClickOutside(dropdownRef, closeDropdown);

  return (
    <div ref={dropdownRef}>
      <FilterButton
        selectedOption={selectedOption}
        filterType={filterType}
        onToggle={toggleDropdown}
        isOpen={isOpen}
      />

      <Dropdown
        options={options}
        isOpen={isOpen}
        selectedOption={selectedOption}
        onSelectOption={handleOptionSelect}
        filterType={filterType}
      />
    </div>
  );
}

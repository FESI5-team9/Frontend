import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Dropdown from "@/components/Filter/Dropdown";
import FilterButton from "@/components/Filter/FilterButton";
import { FilterDropDown } from "@/components/Filter/FilterDropDown";

const mockOnToggle = jest.fn();
const mockOnSelectOption = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("FilterButton Component", () => {
  const renderFilterButton = (props: Partial<FilterButtonProps>) => {
    render(
      <FilterButton
        selectedDateOption={props.selectedDateOption || null}
        selectedOption={props.selectedOption || { ko: "기본 옵션", eng: "" }}
        filterType={props.filterType || "selectionFilter"}
        onToggle={props.onToggle || mockOnToggle}
        isOpen={props.isOpen || false}
      />,
    );
  };

  test("sortFilter 타입으로 렌더링", () => {
    renderFilterButton({
      selectedOption: { ko: "정렬 필터", eng: "sortFilter" },
      filterType: "sortFilter",
    });

    expect(screen.getByText("정렬 필터")).toBeInTheDocument();
    expect(screen.getByAltText("sortFilter")).toBeInTheDocument();

    const sortFilterImage = screen.getByAltText("sortFilter");
    expect(sortFilterImage.getAttribute("src")).toBe("/images/filter/swap_vert.svg");
  });

  test("selectionFilter 타입으로 렌더링", () => {
    renderFilterButton({
      selectedOption: { ko: "선택 필터", eng: "selectionFilter" },
      filterType: "selectionFilter",
    });

    expect(screen.getByText("선택 필터")).toBeInTheDocument();
    expect(screen.getByAltText("selectionFilter")).toBeInTheDocument();

    const selectionFilterImage = screen.getByAltText("selectionFilter");
    expect(selectionFilterImage.getAttribute("src")).toBe("/images/filter/arrow_drop_down.svg");
  });

  test("calendarFilter 타입으로 렌더링", () => {
    const dateOption = { firstDate: "01.15", secondDate: "01.24" };

    renderFilterButton({
      filterType: "calendarFilter",
      selectedDateOption: dateOption,
    });

    expect(screen.getByAltText("calendarFilter")).toBeInTheDocument();

    const selectionFilterImage = screen.getByAltText("calendarFilter");
    expect(selectionFilterImage.getAttribute("src")).toBe("/images/filter/arrow_drop_down.svg");

    // 버튼 텍스트가 'firstDate - secondDate'형식에 맞게 렌더링된다.
    expect(screen.getByText("01.15 - 01.24")).toBeInTheDocument();
  });

  test("calendarFilter selectedDateOption 없을 때 기본 텍스트가 렌더링된다.", () => {
    renderFilterButton({ filterType: "calendarFilter" });
    expect(screen.getByText("날짜 선택")).toBeInTheDocument();
  });

  test("firstDate만 있을 때는 'firstDate - firstDate'가 렌더링된다.", () => {
    const dateOption = { firstDate: "01.15" };

    renderFilterButton({
      filterType: "calendarFilter",
      selectedDateOption: dateOption,
    });

    expect(screen.getByText("01.15 - 01.15")).toBeInTheDocument();
  });

  test("클릭 시 onToggle이 호출된다", () => {
    renderFilterButton({ filterType: "calendarFilter" });

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});

describe("Dropdown 컴포넌트", () => {
  const options = [
    { ko: "옵션 1", eng: "Option1" },
    { ko: "옵션 2", eng: "Option2" },
    { ko: "옵션 3", eng: "Option3" },
  ];

  const renderDropdown = (props: Partial<DropdownProps>) => {
    render(
      <Dropdown
        selectedOption={props.selectedOption || options[0]}
        options={props.options || options}
        isOpen={props.isOpen || false}
        onSelectOption={mockOnSelectOption}
        filterType={props.filterType || "selectionFilter"}
      />,
    );
  };

  test("열린 상태에서 옵션들이 렌더링된다", () => {
    renderDropdown({
      isOpen: true,
    });

    const renderedOptions = screen.getAllByRole("option");
    expect(renderedOptions.length).toBe(options.length);

    options.forEach((option, index) => {
      expect(renderedOptions[index]).toHaveTextContent(option.ko);
    });
  });

  test("닫힌 상태에서는 옵션들이 보이지 않는다", () => {
    renderDropdown({
      isOpen: false,
    });

    const dropdown = screen.getByRole("listbox");
    expect(dropdown).toHaveClass("hidden");
  });

  test("옵션 클릭 시 onSelectOption이 호출된다", () => {
    renderDropdown({
      isOpen: true,
    });

    const optionToClick = screen.getByText("옵션 2");
    fireEvent.click(optionToClick);

    expect(mockOnSelectOption).toHaveBeenCalledWith(options[1]);
  });

  test.each([
    { filterType: "selectionFilter", expectedClass: "w-[110px]" },
    { filterType: "sortFilter", expectedClass: "w-[120px]" },
  ])("filterType에 따라 다른 클래스가 적용된다.", ({ filterType, expectedClass }) => {
    renderDropdown({
      isOpen: true,
      filterType: filterType,
    });

    const dropdown = screen.getByRole("listbox");
    expect(dropdown).toHaveClass(expectedClass);
  });
});

describe("FilterDropDown 컴포넌트", () => {
  const mockOnSelectFilterOption = jest.fn();
  const options = [
    { ko: "기본 옵션", eng: "" },
    { ko: "옵션 1", eng: "Option1" },
    { ko: "옵션 2", eng: "Option2" },
    { ko: "옵션 3", eng: "Option3" },
  ];

  const renderFilterDropDown = () => {
    render(
      <FilterDropDown
        filterType="selectionFilter"
        options={options}
        onSelectFilterOption={mockOnSelectFilterOption}
      />,
    );
  };

  test("초기 상태에서 첫 번째 옵션이 기본 옵션으로 선택된다", () => {
    renderFilterDropDown();

    const button = screen.getByRole("button");
    expect(button.textContent).toBe("기본 옵션");
  });

  test("FilterButton 클릭 시 Dropdown이 토글된다", () => {
    renderFilterDropDown();

    // FilterButton 클릭하여 Dropdown 열기
    const button = screen.getByRole("button");
    const dropdown = screen.getByRole("listbox");

    // 초기 상태: Dropdown 닫힌 상태
    expect(dropdown).toHaveClass("hidden");

    // 첫 번째 클릭: Dropdown 열기
    fireEvent.click(button);
    expect(dropdown).toHaveClass("block");

    // 두 번째 클릭: Dropdown 닫기
    fireEvent.click(button);
    expect(dropdown).toHaveClass("hidden");
  });

  test("Dropdown에서 옵션 선택 시 onSelectFilterOption 호출 및 닫기", () => {
    renderFilterDropDown();

    // FilterButton 클릭하여 Dropdown 열기
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // 옵션 선택
    const option = screen.getByText("옵션 2");
    fireEvent.click(option);

    //onSelectFilterOption 호출
    expect(mockOnSelectFilterOption).toHaveBeenCalledWith("Option2");

    // Dropdown 닫힘 확인
    const dropdown = screen.getByRole("listbox");
    expect(dropdown).toHaveClass("hidden");
  });

  test("Dropdown에서 옵션 선택 시 버튼 텍스트가 선택된 옵션으로 업데이트된다", () => {
    renderFilterDropDown();

    // FilterButton 클릭하여 Dropdown 열기
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // 옵션 선택
    const option = screen.getByText("옵션 2");
    fireEvent.click(option);

    // 버튼 텍스트가 선택된 옵션으로 업데이트
    expect(button.textContent).toBe("옵션 2");
  });
});

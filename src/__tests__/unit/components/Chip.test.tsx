import { render, screen } from "@testing-library/react";
import Chip from "@/components/Chips";
// Chip 컴포넌트 경로
import { ChipProps } from "@/types/components/chip";

describe("Chip 컴포넌트", () => {
  const defaultProps: ChipProps = {
    type: "default",
    bgColor: "bg-blue-500",
    textColor: "text-white",
    shadow: false,
    fontSize: "text-sm",
    fontWeight: "font-medium",
    className: "",
    children: "테스트 칩",
  };

  it("기본 속성으로 렌더링", () => {
    render(<Chip {...defaultProps} />);
    const chipElement = screen.getByText("테스트 칩");
    expect(chipElement).toBeInTheDocument();
    expect(chipElement).toHaveClass("bg-blue-500 text-white text-sm font-medium rounded-md");
  });

  it("'state' 타입을 올바르게 적용", () => {
    render(<Chip {...defaultProps} type="state" />);
    const chipElement = screen.getByText("테스트 칩");
    expect(chipElement).toHaveClass("rounded-full");
  });

  it("'time' 타입을 올바르게 적용", () => {
    render(<Chip {...defaultProps} type="time" />);
    const chipElement = screen.getByText("테스트 칩");
    expect(chipElement).toHaveClass("rounded-xl");
  });

  it("사용자 지정 배경색과 텍스트 색상 적용", () => {
    render(
      <Chip {...defaultProps} bgColor="bg-red-500" textColor="text-black">
        커스텀 칩
      </Chip>,
    );
    const chipElement = screen.getByText("커스텀 칩");
    expect(chipElement).toHaveClass("bg-red-500 text-black");
  });

  it("그림자가 활성화되었을 때 적용", () => {
    render(<Chip {...defaultProps} shadow={true} />);
    const chipElement = screen.getByText("테스트 칩");
    expect(chipElement).toHaveClass("shadow-xl");
  });

  it("추가 사용자 지정 클래스 이름을 적용", () => {
    render(<Chip {...defaultProps} className="custom-class" />);
    const chipElement = screen.getByText("테스트 칩");
    expect(chipElement).toHaveClass("custom-class");
  });

  it("children 속성으로 내용 렌더링", () => {
    render(<Chip {...defaultProps}>안녕하세요 칩!</Chip>);
    const chipElement = screen.getByText("안녕하세요 칩!");
    expect(chipElement).toBeInTheDocument();
  });
});

import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "@/components/Input/Input";

describe("Input 컴포넌트", () => {
  const mockRegister = {
    onChange: jest.fn(),
    onBlur: jest.fn(),
    name: "testInput",
    ref: jest.fn(),
  };

  const defaultProps = {
    register: mockRegister,
    type: "text" as const,
    name: "testInput",
    label: "테스트 라벨",
    placeholder: "테스트 플레이스홀더",
    error: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("기본 렌더링", () => {
    render(<Input {...defaultProps} />);

    const input = screen.getByLabelText("테스트 라벨");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "테스트 플레이스홀더");
  });

  test("에러 메시지 표시", () => {
    const errorProps = {
      ...defaultProps,
      error: {
        type: "required",
        message: "필수 입력값입니다",
      },
    };

    render(<Input {...errorProps} />);

    expect(screen.getByText("필수 입력값입니다")).toBeInTheDocument();
    expect(screen.getByLabelText("테스트 라벨")).toHaveClass("border-[2px]", "border-red-500");
  });

  test("비밀번호 입력 필드 토글", () => {
    render(<Input {...defaultProps} type="password" name="password" label="비밀번호" />);

    const input = screen.getByLabelText("비밀번호");
    const toggleButton = screen.getByRole("button");
    const hiddenIcon = screen.getByAltText("비밀번호 숨김 아이콘");

    expect(input).toHaveAttribute("type", "password");
    expect(hiddenIcon).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });
});

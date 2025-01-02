// src/__tests__/components/TextArea.test.tsx
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import TextArea from "@/components/Input/TextArea";

describe("TextArea 컴포넌트", () => {
  test("기본 렌더링", () => {
    render(<TextArea name="description" placeholder="내용을 입력하세요" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder", "내용을 입력하세요");
    expect(textarea).toHaveAttribute("id", "description");
  });

  test("스타일 적용 확인", () => {
    render(<TextArea name="description" placeholder="내용을 입력하세요" />);

    const textareaContainer = screen.getByRole("textbox").parentElement;
    expect(textareaContainer).toHaveClass(
      "h-[120px]",
      "w-full",
      "flex-col",
      "rounded-xl",
      "bg-gray-50",
      "px-4",
      "py-[10px]",
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "h-full",
      "w-full",
      "resize-none",
      "bg-gray-50",
      "text-base",
      "font-medium",
      "leading-6",
      "outline-none",
    );
  });

  test("사용자 입력", () => {
    render(<TextArea name="description" placeholder="내용을 입력하세요" />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "테스트 내용" } });
    expect(textarea).toHaveValue("테스트 내용");
  });
});

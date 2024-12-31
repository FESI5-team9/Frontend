import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import * as favoriteApi from "@/apis/favoriteGatheringApi";
import Button from "@/components/Button/Button";
import FavoriteButton from "@/components/Button/FavoriteButton";
import LinkButton from "@/components/Button/LinkButton";
import { getFilledStyle, getOutlinedStyle, getSizeClasses } from "@/components/Button/buttonStyles";
import useUserStore from "@/store/userStore";

describe("Button 컴포넌트", () => {
  test("기본 렌더링", () => {
    render(<Button>테스트 버튼</Button>);
    expect(screen.getByText("테스트 버튼")).toBeInTheDocument();
  });

  test("onClick 이벤트", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>클릭</Button>);

    fireEvent.click(screen.getByText("클릭"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("disabled 상태", () => {
    render(<Button disabled>비활성화 버튼</Button>);
    expect(screen.getByText("비활성화 버튼")).toBeDisabled();
  });

  test("다양한 스타일 적용", () => {
    const { rerender } = render(
      <Button bgColor="yellow" size="small" isFilled={true}>
        스타일 테스트
      </Button>,
    );

    const buttonElement = screen.getByText("스타일 테스트");
    expect(buttonElement).toHaveClass("bg-yellow-primary", "text-gray-800", "h-10");

    rerender(
      <Button bgColor="orange" size="large" isFilled={false}>
        스타일 테스트
      </Button>,
    );

    expect(buttonElement).toHaveClass("text-orange-primary", "border-orange-primary", "h-12");
  });
});

describe("LinkButton 컴포넌트", () => {
  test("기본 렌더링", () => {
    render(<LinkButton href="/test">링크 버튼</LinkButton>);
    const link = screen.getByRole("link");
    const button = screen.getByRole("button");

    expect(link).toHaveAttribute("href", "/test");
    expect(button).toHaveTextContent("링크 버튼");
  });

  test("스타일 적용", () => {
    render(
      <LinkButton href="/test" bgColor="red" size="small" isFilled={false}>
        스타일 테스트
      </LinkButton>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-red-primary", "border-red-primary", "h-10");
  });
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/apis/favoriteGatheringApi");
jest.mock("@/store/userStore", () => ({
  default: jest.fn(() => ({
    id: 1,
    setFavoriteGatheringCount: jest.fn(),
  })),
}));

describe("FavoriteButton 컴포넌트", () => {
  const mockUserStore = {
    id: 1,
    setFavoriteGatheringCount: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserStore as jest.MockedFunction<typeof useUserStore>).mockImplementation(
      () => mockUserStore,
    );
  });

  test("초기 상태 렌더링", () => {
    render(<FavoriteButton gatheringId={1} initialFavorite={false} />);
    expect(screen.getByAltText("like")).toHaveAttribute("src", "/images/heart/empty_heart.svg");
  });

  test("찜하기 토글", async () => {
    (favoriteApi.getFavoriteGathering as jest.Mock).mockResolvedValue({});
    (favoriteApi.getFavoriteGatherings as jest.Mock).mockResolvedValue([]);

    render(<FavoriteButton gatheringId={1} initialFavorite={false} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(screen.getByAltText("like")).toHaveAttribute("src", "/images/heart/filled_heart.svg");
  });
});

describe("버튼 스타일 유틸리티", () => {
  describe("getFilledStyle", () => {
    test("disabled 상태", () => {
      expect(getFilledStyle("yellow", true)).toBe("bg-gray-400 text-white cursor-not-allowed");
    });

    test("각 색상별 스타일", () => {
      expect(getFilledStyle("yellow")).toBe("bg-yellow-primary text-gray-800");
      expect(getFilledStyle("orange")).toBe("bg-orange-primary text-white");
      expect(getFilledStyle("red")).toBe("bg-red-primary text-white");
    });
  });

  describe("getOutlinedStyle", () => {
    test("disabled 상태", () => {
      expect(getOutlinedStyle("yellow", true)).toBe(
        "bg-white text-gray-400 border border-gray-400 cursor-not-allowed",
      );
    });

    test("각 색상별 스타일", () => {
      expect(getOutlinedStyle("yellow")).toBe(
        "bg-white text-yellow-primary border border-yellow-primary",
      );
    });
  });

  describe("getSizeClasses", () => {
    test("각 사이즈별 클래스", () => {
      expect(getSizeClasses("small")).toBe("h-10 px-4 text-sm");
      expect(getSizeClasses("large")).toBe("h-12 px-6 text-base");
      expect(getSizeClasses("onlyPadding")).toBe("px-2 text-base");
    });
  });
});

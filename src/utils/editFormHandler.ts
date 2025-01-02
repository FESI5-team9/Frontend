import { Dispatch, SetStateAction } from "react";
import { UseFormSetValue } from "react-hook-form";

// 폼 데이터 타입 정의
export interface EditGatheringFormData {
  name?: string;
  image?: File | string | null;
  description?: string;
  keyword?: string[];
}

// 입력값 업데이트 핸들러
export const handleKeywordChange = (
  value: string,
  setKeywordInput: Dispatch<SetStateAction<string>>,
) => {
  setKeywordInput(value);
};

//키워드 추가 함수
export const handleKeywordAddition = (
  value: string,
  keywords: string[],
  setKeywordValue: React.Dispatch<string>,
  setValue: UseFormSetValue<EditGatheringFormData>, // React Hook Form setValue 타입
) => {
  const trimmedValue = value.trim();

  if (trimmedValue.startsWith("#") && trimmedValue.length > 1) {
    const newKeyword = trimmedValue.slice(1); // '#' 제거
    setTimeout(() => {
      setKeywordValue(""); // 입력 필드 초기화
    }, 0);

    if (!keywords.includes(newKeyword)) {
      setValue("keyword", [...keywords, newKeyword]); // React Hook Form 상태 업데이트
    }
  }
};

export const handleKeywordDelete = (
  index: number,
  keywords: string[],
  setValue: UseFormSetValue<EditGatheringFormData>,
) => {
  setValue(
    "keyword",
    keywords.filter((_, i) => i !== index), // 키워드 삭제
  );
};

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { UseFormSetValue } from "react-hook-form";
import fetchWithMiddleware from "@/apis/fetchWithMiddleware";

// 폼 데이터 타입 정의
export interface CreateGatheringFormData {
  name: string;
  type: "RESTAURANT" | "CAFE" | "PUB" | "VEGAN";
  location?: string;
  image?: File | null;
  dateTime: string;
  capacity: number;
  description?: string;
  address1?: string;
  address2?: string;
  openParticipantCount?: number;
  keyword: string[];
}

// 핸들러 함수들
export const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setFormData: Dispatch<SetStateAction<CreateGatheringFormData>>,
) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};

// 주소 업데이트 핸들러
export const handleAddressSelect = (
  location: string,
  address1: string,
  address2: string,
  setSelectedAddress: Dispatch<
  SetStateAction<{ location: string; address1: string; address2: string }>
  >,
  setFormData: Dispatch<SetStateAction<CreateGatheringFormData>>,
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>,
) => {
  setSelectedAddress({ location, address1, address2 });
  setFormData(prev => ({
    ...prev,
    location,
    address1,
    address2,
  }));
  setIsSearchOpen(false); // 주소 선택 후 검색창 닫기
  // console.log("상위 컴포넌트로 전달된 주소 데이터:", { location, address1, address2 }); // 디버깅용 로그
};

// 파일 변경 핸들러
export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<CreateGatheringFormData>>,
) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    setFormData(prev => ({
      ...prev,
      image: files[0],
    }));
  }
};

// 날짜 선택 핸들러
export const handleDateSelect = (
  date: Date,
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>,
  setFormData: Dispatch<SetStateAction<CreateGatheringFormData>>,
) => {
  setSelectedDate(date);
  setFormData(prev => ({
    ...prev,
    dateTime: date.toISOString().split("T")[0],
  }));
};

// 시간 선택 핸들러
export const handleTimeSelect = (
  time: string,
  selectedDate: Date | undefined,
  setSelectedTime: Dispatch<SetStateAction<string>>,
  setFormData: Dispatch<SetStateAction<CreateGatheringFormData>>,
) => {
  setSelectedTime(time);

  if (selectedDate) {
    // 선택된 시간을 기준으로 Date 객체 생성
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes);

    // formData 업데이트
    setFormData(prev => ({
      ...prev,
      dateTime: `${selectedDate.toISOString().split("T")[0]}T${time}:00`,
    }));
  }
};

export const handleNumberChange = (
  name: keyof CreateGatheringFormData,
  value: string,
  setValue: UseFormSetValue<CreateGatheringFormData>,
) => {
  const numericValue = value.replace(/\D/g, ""); // 숫자가 아닌 문자 제거
  setValue(name, numericValue); // react-hook-form 상태 업데이트
};

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
  setValue: UseFormSetValue<CreateGatheringFormData>, // React Hook Form setValue 타입
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
  setValue: UseFormSetValue<CreateGatheringFormData>,
) => {
  setValue(
    "keyword",
    keywords.filter((_, i) => i !== index), // 키워드 삭제
  );
};

export const handleSubmitToServer = async (
  data: CreateGatheringFormData,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  addToast: (toast: { message: string; type: "success" | "error" }) => void,
  router: ReturnType<typeof useRouter>,
) => {
  const formDataToSend = new FormData();

  // FormData 변환
  Object.entries(data).forEach(([key, value]) => {
    if (key === "image" && value instanceof File) {
      formDataToSend.append(key, value); // File 객체 추가
    } else if (key === "keyword" && Array.isArray(value)) {
      // keyword를 배열 그대로 추가
      formDataToSend.append(key, value.join(",")); // 콤마로 구분된 문자열로 변환
    } else if (value !== null && value !== undefined) {
      formDataToSend.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
    }
  });

  try {
    const response = await fetchWithMiddleware(`/api/gatherings`, {
      method: "POST",
      body: formDataToSend,
    });
    const responseData = await response.json();
    if (!response.ok) throw new Error("서버 응답 오류!");
    setIsOpen(false);
    addToast({ message: "모임이 성공적으로 생성되었습니다!", type: "success" });
    // router.push로 이동
    if (responseData?.id) {
      router.push(`/groupDetail/${responseData.id}`);
    } else {
      throw new Error("서버에서 ID를 반환하지 않았습니다.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    addToast({
      message: error instanceof Error ? error.message : "오류가 발생했습니다. 다시 시도해주세요.",
      type: "error",
    });
  }
};

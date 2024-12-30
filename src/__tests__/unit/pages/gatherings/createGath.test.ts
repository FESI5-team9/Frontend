import { CreateGatheringSchema } from "@/utils/createGathSchema";
import { CreateGatheringFormData } from "@/utils/formHandler";

describe("CreateGatheringSchema", () => {
  const validData: CreateGatheringFormData = {
    name: "테스트",
    type: "CAFE",
    location: "SEOUL",
    address1: "서울시",
    address2: "서울시 강남구",
    openParticipantCount: 5,
    capacity: 10,
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 내일 날짜
    description: "테스트 모임 설명",
    keyword: ["카페", "맛집"],
    image: null,
  };

  test("유효한 데이터", () => {
    expect(() => CreateGatheringSchema.parse(validData)).not.toThrow();
  });

  test("모임 이름 - 공백일 때 실패", () => {
    const invalidData = { ...validData, name: "" };
    expect(() => CreateGatheringSchema.parse(invalidData)).toThrow("모임 이름은 필수 입력입니다.");
  });

  test("날짜와 시간 - 과거날짜 실패", () => {
    const invalidData = {
      ...validData,
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    };
    expect(() => CreateGatheringSchema.parse(invalidData)).toThrow(
      "과거의 날짜는 선택할 수 없어요.",
    );
  });

  test("최소 인원과 최대 정원이 유효한 경우", () => {
    const invalidData = { ...validData, capacity: 10, openParticipantCount: 2 };
    expect(() => CreateGatheringSchema.parse(invalidData)).not.toThrow();
  });

  test("참가자 수 - 최소값보다 적을 때 실패", () => {
    const invalidData = { ...validData, openParticipantCount: 1 };
    expect(() => CreateGatheringSchema.parse(invalidData)).toThrow("2인 이상이어야해요");
  });

  test("참여 정원 : NaN", () => {
    const invalidData = { ...validData, capacity: "열명" }; // 숫자가 아닌 값
    expect(() => CreateGatheringSchema.parse(invalidData)).toThrow("숫자만 입력 가능해요.");
  });
});

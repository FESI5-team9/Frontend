import { formatToKoreanTime, formatToOriginTime, getRemainingOriginHours } from "@/utils/date";

describe("date-fns 테스트", () => {
  const isoDate = "2024-12-31T23:59:59Z";
  const dateString = "yyyy년 MM월 dd일 HH시 mm분";

  describe("formatToOriginTime", () => {
    test("성공 케이스", () => {
      const result = formatToOriginTime(isoDate, dateString);
      expect(result).toBe("2025년 01월 01일 08시 59분");
    });

    test("실패 케이스", () => {
      const result = formatToOriginTime(isoDate, dateString);
      expect(result).toBe("2025년 01월 01일 08시 00분");
    });
  });

  describe("formatToKoreanTime", () => {
    test("성공 케이스", () => {
      const result = formatToKoreanTime(isoDate, dateString);
      expect(result).toBe("2025년 01월 01일 08시 59분");
    });

    test("실패 케이스", () => {
      const result = formatToKoreanTime(isoDate, dateString);
      expect(result).toBe("2025년 01월 01일 08시 22분");
    });
  });

  describe("getRemainingHours", () => {
    test("성공 케이스", () => {
      const result = getRemainingOriginHours(isoDate);
      expect(result).toBe("4일 후 마감");
    });

    test("실패 케이스", () => {
      const result = getRemainingOriginHours(isoDate);
      expect(result).toBe("5일 후 마감");
    });
  });
});

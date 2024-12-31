import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  parseISO,
} from "date-fns";
import { ko } from "date-fns/locale";

export const formatToOriginTime = (isoDate: string, dateString: string) => {
  // ISO 형식의 날짜를 Date 객체로 변환
  const date = parseISO(isoDate);
  // dateString 예시: "yyyy년 MM월 dd일 HH시 mm분"
  return format(date, dateString);
};

// 한국 시간으로 변환하는 함수.
export const formatToKoreanTime = (isoDate: string, dateString: string) => {
  // ISO 형식의 날짜를 Date 객체로 변환
  const date = parseISO(isoDate);
  // 한국 표준시 기준 포맷 (yyyy년 MM월 dd일 HH:mm:ss)
  // dateString 예시: "yyyy년 MM월 dd일 HH시 mm분"
  return format(date, dateString, { locale: ko });
};

export const getRemainingOriginHours = (isoDeadline: string): string => {
  try {
    const deadline = new Date(parseISO(isoDeadline));
    const now = new Date();

    if (deadline <= now) {
      return "마감이 지났습니다.";
    }

    const daysLeft = differenceInDays(deadline, now);
    const hoursLeft = differenceInHours(deadline, now) % 24; // 남은 시간만 계산
    const minutesLeft = differenceInMinutes(deadline, now) % 60; // 남은 분만 계산

    switch (true) {
      case daysLeft >= 1:
        return `${daysLeft}일 후 마감`;
      case hoursLeft >= 1:
        return `${hoursLeft}시간 후 마감`;
      case minutesLeft >= 1:
        return `${minutesLeft}분 후 마감`;
      default:
        return "곧 마감됩니다.";
    }
  } catch (error) {
    return "유효하지 않은 날짜 형식입니다.";
  }
};

//이건 확인해보고 안쓰면 나중에 지울게요
export const getRemainingHours = (isoDeadline: string): string => {
  try {
    // 마감 시간을 ISO 형식으로 파싱
    const deadline = parseISO(isoDeadline);
    // 한국 시간 기준으로 맞추기 위해 9시간 추가 (UTC+9)
    const koreanDeadline = new Date(deadline.getTime() + 9 * 60 * 60 * 1000);
    // 현재 한국 시간
    const now = new Date();
    const koreanNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    // 두 날짜 사이의 시간 차이를 계산
    const hoursLeft = differenceInHours(koreanDeadline, koreanNow);
    // 결과 반환 (시간이 남았는지 여부)
    return hoursLeft > 0 ? `${hoursLeft}시간 뒤 마감` : "마감이 지났습니다.";
  } catch (error) {
    return "유효하지 않은 날짜 형식입니다.";
  }
};

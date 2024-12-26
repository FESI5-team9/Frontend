import { useEffect } from "react";
import { PostcodeData } from "@/types/components/kakaoMap";

export const LOCATION_MAP: { [key: string]: string } = {
  서울: "SEOUL",
  부산: "GYEONGSANG_DO",
  대구: "GYEONGSANG_DO",
  인천: "GYEONGGI_DO",
  광주: "JEOLLA_DO",
  대전: "CHUNGCHEONG_DO",
  울산: "GYEONGSANG_DO",
  세종: "CHUNGCHEONG_DO",
  경기: "GYEONGGI_DO",
  강원: "GANGWON_DO",
  충북: "CHUNGCHEONG_DO",
  충남: "CHUNGCHEONG_DO",
  전북: "JEOLLA_DO",
  전남: "JEOLLA_DO",
  경북: "GYEONGSANG_DO",
  경남: "GYEONGSANG_DO",
  제주특별자치도: "JEJU_ISLAND",
};

function mapToEnumLocation(koreanLocation: string): string {
  return LOCATION_MAP[koreanLocation] || ""; // 매핑되지 않으면 UNKNOWN 반환
}

export default function Kakao({
  onAddressSelect,
}: {
  onAddressSelect: (address1: string, address2: string, location: string) => void;
}) {
  useEffect(() => {
    // Daum Postcode API 스크립트 로드
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => {
      const container = document.getElementById("postcode-container");
      if (container) {
        container.innerHTML = ""; // 이전에 렌더링된 내용 초기화
        new window.daum.Postcode({
          oncomplete: (data: PostcodeData) => {
            const rowLocation = `${data.sido}`;
            const location = mapToEnumLocation(rowLocation);
            const address1 = `${data.sido} ${data.sigungu}`;
            const address2 = data.roadAddress || "";
            onAddressSelect(location, address1, address2); // 주소 선택 시 상위 컴포넌트로 전달
          },
          width: "100%",
          height: "100%",
        }).embed(container);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // 스크립트 클린업
    };
  }, [onAddressSelect]);

  return (
    <div
      id="postcode-container"
      className="rounded-md border p-4"
      style={{ width: "100%", height: "500px" }}
    ></div>
  );
}

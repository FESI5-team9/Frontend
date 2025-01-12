"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type MapProps = {
  address: string;
};

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOJSKEY}&libraries=services&autoload=false`;

export default function Map({ address }: MapProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (document.getElementById("kakao-sdk")) return;

    const script = document.createElement("script");
    script.id = "kakao-sdk";
    script.src = KAKAO_SDK_URL;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소 변환
        geocoder.addressSearch(address, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const newLatLng = {
              lat: parseFloat(result[0].y),
              lng: parseFloat(result[0].x),
            };
            setLatLng(newLatLng);
            setIsMapLoaded(true); // 지도 로드 성공
          } else {
            console.error("주소 변환 실패:", status);
          }
          setIsLoading(false);
        });
      });
    };

    return () => {
      const scriptElement = document.getElementById("kakao-sdk");
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [address]);

  useEffect(() => {
    if (!latLng) return;

    const container = document.getElementById("map");
    if (!container) {
      console.error("지도를 표시할 container가 없습니다.");
      return;
    }

    const coords = new kakao.maps.LatLng(latLng.lat, latLng.lng);
    const map = new kakao.maps.Map(container, { center: coords, level: 3 });

    new kakao.maps.Marker({
      map,
      position: coords,
    });

    map.setCenter(coords);
  }, [latLng]);

  return (
    <div className="h-full w-full">
      {isLoading ? (
        // 로딩 중
        <div className="flex h-[336px] w-full items-center justify-center rounded-2xl bg-gray-100 tablet:h-[180px]">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-transparent" />
        </div>
      ) : isMapLoaded ? (
        // 지도 로드 성공
        <div className="h-[336px] w-full rounded-2xl bg-gray-100 tablet:h-[180px]">
          <div
            role="region"
            aria-label={`${address} 주변 지도`}
            id="map"
            style={{ width: "100%", height: "100%", borderRadius: "16px" }}
          />
        </div>
      ) : (
        //지도 로드 실패
        <div className="flex h-[336px] w-full items-center justify-center rounded-2xl bg-gray-100 tablet:h-[180px]">
          <p className="text-center text-sm font-medium text-gray-500">
            지도를 불러오는 데 문제가 발생했습니다. &#128549; <br />
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      )}
      <div className="mt-2 flex items-center gap-1">
        <div className="flex size-[18px] items-center justify-center">
          <Image src="/images/detailPage/location.svg" alt="위치" width={12} height={16} />
        </div>
        <p aria-label={`모임 장소 주소: ${address}`} className="text-sm font-medium text-[#3C3C3C]">
          {address}
        </p>
      </div>
    </div>
  );
}

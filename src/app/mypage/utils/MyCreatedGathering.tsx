"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { recruitGathering } from "@/apis/assignGatheringApi";
import { getMyGathering } from "@/apis/searchGatheringApi";
import Button from "@/components/Button/Button";
import useUserStore from "@/store/userStore";
import { GatheringsRes } from "@/types/api/gatheringApi";
import { formatToKoreanTime } from "@/utils/date";
import { SkeletonUncompleted } from "../components/Skeleton";

export default function MyCreatedGathering() {
  const [gatheringData, setGatheringData] = useState<GatheringsRes>([]);
  const { id } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleGatheringStatus = async (gatheringId: number) => {
    try {
      const response = await recruitGathering(gatheringId, "RECRUITMENT_COMPLETED");
      if (response) {
        setGatheringData(prevData =>
          prevData.map(gathering =>
            gathering.id === gatheringId
              ? { ...gathering, status: "RECRUITMENT_COMPLETED" }
              : gathering,
          ),
        );
      } else {
        alert("모임 상태 변경에 실패했습니다.");
      }
    } catch (err) {}
  };

  const fetchGatheringData = async (currentPage: number) => {
    const params = {
      userId: id || undefined,
      size: 5,
      page: currentPage,
      sort: "dateTime",
      direction: "desc" as const,
    };

    setIsLoading(true);
    try {
      const response = await getMyGathering(params);
      if (response.length > 0) {
        setGatheringData(prevData => {
          // 중복 제거 로직: 기존 데이터와 새 데이터의 ID를 기준으로 중복 필터링
          const newData = response.filter(
            newItem => !prevData.some(existingItem => existingItem.id === newItem.id),
          );
          return [...prevData, ...newData];
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGatheringData(page); // 함수 호출 추가
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prevPage => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    const currentObserverRef = observerRef.current; // 로컬 변수에 저장

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef); // 로컬 변수 사용
      }
    };
  }, [hasMore, isLoading]);

  if (isLoading && gatheringData.length === 0) return <SkeletonUncompleted />;

  if (!gatheringData || gatheringData.length === 0) {
    return <div>아직 만든 모임이 없습니다.</div>;
  }

  return (
    <>
      {gatheringData.map((gathering, _index) => {
        const date = gathering.dateTime
          ? formatToKoreanTime(gathering.dateTime, "M월 dd일")
          : "날짜 없음";
        const time = gathering.dateTime
          ? formatToKoreanTime(gathering.dateTime, "HH시 mm분")
          : "시간 없음";

        return (
          <div
            key={gathering.id}
            className="flex w-full flex-col gap-4 tablet:h-[153px] tablet:flex-row"
          >
            <div className="relative flex h-[153px] w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl tablet:w-[280px]">
              <Image
                src={gathering.image || "/images/image.png"}
                fill
                objectFit="cover"
                alt="모임 이미지"
                className=""
              />
            </div>
            <div className="flex w-full flex-col justify-between">
              <div className="flex gap-3">
                <div className="mb-[18px] flex flex-col gap-1.5">
                  <span className="flex items-center gap-2 text-lg font-semibold">
                    <span className="inline-block max-w-[135px] truncate tablet:max-w-[170px] desktop:max-w-[300px]">
                      {gathering.name}
                    </span>
                    <span className="inline-block">|</span>
                    <span className="text-#3C3C3C inline-block max-w-[135px] truncate text-sm tablet:max-w-[155px] desktop:max-w-[300px]">
                      &nbsp;{`${gathering.location} ${gathering.address1}`}
                    </span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-#3C3C3C flex gap-3 text-sm">{`${date} · ${time}`}</span>
                    <span className="flex gap-0.5">
                      <Image
                        src="/icons/person.svg"
                        width={16}
                        height={16}
                        alt="참여 인원"
                        className="inline-block"
                      />
                      <span className="inline-block text-sm">{`${gathering.participantCount}/${gathering.capacity}`}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex tablet:justify-end tablet:pb-1">
                <Button
                  size="small"
                  bgColor="disabled"
                  onClick={() => handleGatheringStatus(gathering.id)}
                  className="w-[120px] px-0 text-sm text-white"
                >
                  {gathering.status === "RECRUITMENT_COMPLETED" ? "마감 완료" : "조기 마감"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      {hasMore && <div ref={observerRef} className="h-10 w-full"></div>}
    </>
  );
}

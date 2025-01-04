"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getFavoriteGatherings } from "@/apis/favoriteGatheringApi";
import Toast from "@/components/Toast";
import Card from "@/app/(home)/_components/Card";
import SKCardList from "@/app/(home)/_components/Skeleton/SKCardList";
import { GetGathering } from "@/types/components/card";

type GatheringFilters = Record<string, string | number | null>;

export default function FavoriteGathClient() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const f: GatheringFilters = {};
    searchParams?.forEach((value, key) => {
      if (
        ["id", "type", "startDate", "endDate", "location", "createdBy", "direction"].includes(key)
      ) {
        f[key] = value;
      }
    });
    return f;
  }, [searchParams]);

  // React Query로 데이터 처리**
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ["favoriteGathering", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getFavoriteGatherings({ ...filters, page: pageParam });
      return {
        data: result.map(gathering => ({ ...gathering, favorite: true })),
        nextPage: result.length > 0 ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage.nextPage,
    refetchOnMount: "always",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // IntersectionObserver로 무한 스크롤 구현
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching]);

  const handleUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["favoriteGathering"] });
  };

  // 데이터 병합 및 중복 제거
  const allData = Array.from(
    new Map((data?.pages.flatMap(page => page.data) || []).map(item => [item.id, item])).values(),
  );

  // 데이터 없을 때 처리
  if (isLoading) {
    return (
      <div className="gathering-list my-6 flex flex-col gap-3">
        <SKCardList />
      </div>
    );
  }

  if (allData.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-gray-400">
        <p>아직 모임이 없어요.</p>
        <p>지금 바로 모임을 찜 해보세요.</p>
      </div>
    );
  }

  return (
    <div className="gathering-list my-6 flex flex-col gap-3">
      {allData.map((gathering: GetGathering) => (
        <Card key={gathering.id} cardData={gathering} onUpdate={handleUpdate} />
      ))}
      <Toast />
      <div ref={observerRef} className="h-10 w-full bg-transparent"></div>
    </div>
  );
}

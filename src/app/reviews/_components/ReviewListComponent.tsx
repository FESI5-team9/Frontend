"use client";

import { useEffect, useRef } from "react";
import { FilterDropDown } from "@/components/Filter/FilterDropDown";
import { LOCATION_OPTIONS, REVIEW_SORT_OPTIONS } from "@/constants/filter";
import { GetReviews, ReviewsRes } from "@/types/api/reviews";
import AllReviewCard from "./ReviewCard";
import ReviewCardSkeleton from "./Skeleton/ReviewCardSkeleton";

interface Filters {
  type: GetReviews["type"];
  location: GetReviews["location"];
  sort: string;
}

interface ReviewListComponentProps {
  reviews: ReviewsRes;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function ReviewListComponent({
  reviews,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  setFilters,
  filters,
}: ReviewListComponentProps) {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleLocationFilter = (location: string) => {
    setFilters(prev => ({ ...prev, location: location as GetReviews["location"] }));
  };

  const handleSortFilter = (sort: string) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <FilterDropDown
            key={`location-${filters.type}`}
            filterType="selectionFilter"
            options={LOCATION_OPTIONS}
            onSelectFilterOption={handleLocationFilter}
          />
        </div>
        <FilterDropDown
          key={`location-${filters.type}`}
          filterType="sortFilter"
          options={REVIEW_SORT_OPTIONS}
          onSelectFilterOption={handleSortFilter}
        />
      </div>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <ReviewCardSkeleton key={index} />
              ))}
          </div>
        ) : Array.isArray(reviews) && reviews.length > 1 ? (
          <>
            <AllReviewCard reviews={reviews} />

            {isFetchingNextPage && (
              <div className="space-y-2">
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <ReviewCardSkeleton key={index} />
                  ))}
              </div>
            )}

            <div ref={loadMoreRef} className="h-4" />
          </>
        ) : (
          <div className="flex h-40 items-center justify-center text-gray-500">
            리뷰가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewListComponent;

"use client";

import { useState } from "react";
import Image from "next/image";
import { InfiniteData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getReviewStats, getReviews } from "@/apis/reviewsApi";
import { categories } from "@/constants/categoryList";
import { GetReviewStatsRes, GetReviews, ReviewsRes } from "@/types/api/reviews";
import RatingComponent from "./RatingComponent";
import ReviewListComponent from "./ReviewListComponent";

const PAGE_SIZE = 10;

interface Filters {
  type: GetReviews["type"];
  location: GetReviews["location"];
  sort: string;
}

type ReviewQueryKey = readonly ["reviews", Filters];

function AllReviews() {
  const [type, setType] = useState<Category["link"]>("RESTAURANT");
  const [filters, setFilters] = useState<Filters>({
    type: "RESTAURANT",
    location: undefined,
    sort: "createdAt",
  });

  const handleTypeChange = (newType: Category["link"]) => {
    setType(newType);
    setFilters({
      type: newType,
      location: undefined,
      sort: "createdAt",
    });
  };

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useInfiniteQuery<ReviewsRes, Error, InfiniteData<ReviewsRes>, ReviewQueryKey>({
    queryKey: ["reviews", filters] as const,
    queryFn: async context => {
      const response = await getReviews({
        ...filters,
        page: context.pageParam as number,
        size: PAGE_SIZE,
      });
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (!lastPage || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return Math.floor(lastPage.length / PAGE_SIZE) + 1;
    },
  });

  const { data: stats } = useQuery<GetReviewStatsRes>({
    queryKey: ["stats", { type }],
    queryFn: () => getReviewStats(type),
  });

  const reviews = reviewsData?.pages.flat() ?? [];

  return (
    <>
      <div className="mb-1 flex flex-row items-center gap-4 px-2 tablet:px-0">
        <Image
          src="/images/mainPage/head.svg"
          width={72}
          height={72}
          className="h-auto w-auto"
          alt="head"
          priority
        />
        <div>
          <h4 className="text-2xl">모든리뷰</h4>
          <h1 className="pb-2 text-sm">밀엔메이트를 이용한 분들은 이렇게 느꼈어요!</h1>
        </div>
      </div>

      <div className="flex justify-between px-2 pb-2 tablet:px-0">
        <ul className="flex gap-3 p-2 text-lg tablet:justify-between tablet:gap-4">
          {categories.map(category => (
            <li
              key={category.name}
              onClick={() => handleTypeChange(category.link)}
              className={`flex list-none items-center gap-[3px] border-b-2 ${
                type === category.link
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400"
              } hover:cursor-pointer`}
            >
              <p>{category.name}</p>
              <Image
                src={type === category.link ? category.icon : category.disabled}
                alt={category.alt}
                width={18}
                height={20}
                className="hidden h-[20px] w-[18px] object-contain tablet:block"
              />
            </li>
          ))}
        </ul>
      </div>

      <RatingComponent stats={stats} />

      <ReviewListComponent
        reviews={reviews}
        isLoading={isReviewsLoading}
        isError={isReviewsError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        filters={{ ...filters, type }}
        setFilters={setFilters}
      />
    </>
  );
}

export default AllReviews;

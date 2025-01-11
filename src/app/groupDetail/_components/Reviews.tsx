"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { UseQueryResult, keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReviews, getReviewsRating } from "@/apis/reviewsApi";
import ReviewRatingComponent from "@/app/groupDetail/_components/ReviewRatingComponent";
import ReviewRatingSkeleton from "@/app/groupDetail/_components/Skeleton/ReviewRatingSkeleton";
import ReviewSkeleton from "@/app/groupDetail/_components/Skeleton/ReviewSkeleton";
import { GetReviewsRatingRes, ReviewsRes } from "@/types/api/reviews";
import { formatToKoreanTime } from "@/utils/date";

export default function Reviews({ gatheringId }: { gatheringId: number }) {
  // page가 0부터 시작함
  const [page, setPage] = useState(0);
  const size = 4;

  // 리뷰 목록 조회
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    error: reviewsError,
  }: UseQueryResult<ReviewsRes, Error> = useQuery({
    queryKey: ["gatheringReviews", gatheringId, page],
    queryFn: () => getReviews({ gatheringId: Number(gatheringId), size, page }),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData, //
  });

  // 리뷰 평점 조회
  const {
    data: ratingData,
    isLoading: isRatingLoading,
    error: ratingError,
  }: UseQueryResult<GetReviewsRatingRes, Error> = useQuery({
    queryKey: ["gatheringReviewRating", gatheringId],
    queryFn: () => getReviewsRating({ gatheringId: Number(gatheringId) }),
    staleTime: 1000 * 60 * 5,
  });

  const totalReviews = useMemo(() => {
    if (!ratingData || ratingData.length !== 1) return 0;
    const { oneStar, twoStars, threeStars, fourStars, fiveStars } = ratingData[0];
    return oneStar + twoStars + threeStars + fourStars + fiveStars;
  }, [ratingData]);

  const totalPages = Math.ceil(totalReviews / size);

  const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 0));
  const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages - 1));

  if (reviewsError || ratingError)
    return (
      <div className="flex w-full items-center justify-center">
        <p>예기치 않은 오류가 발생했습니다. 다시 시도해주시기 바랍니다.</p>
      </div>
    );

  return (
    <div className="bg-white px-4 py-6 tablet:col-span-2 tablet:px-6 tablet:pb-[87px]">
      <div className="min-h-[500px]">
        <h3 className="mb-5 text-lg font-semibold">
          리뷰 <span>{isRatingLoading || `(${totalReviews})`}</span>
        </h3>

        {isReviewsLoading ? (
          <div className="h-full w-full">
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="mt-4">
            <div className="mb-4 border-y border-[#E5E7EB]">
              {isRatingLoading ? (
                <ReviewRatingSkeleton />
              ) : (
                ratingData && (
                  <ReviewRatingComponent
                    ratingData={ratingData[0]}
                    totalReviews={totalReviews || 0}
                  />
                )
              )}
            </div>
            <div className="flex flex-col gap-[10px]">
              {reviews.map(review => (
                <div key={review.id} className="border-b-2 border-dashed border-[#F3F4F6] pb-4">
                  <div className="flex h-[86px] flex-col justify-between">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex h-6 w-6 items-center justify-center">
                          <Image
                            width={24}
                            height={22}
                            alt="평점"
                            src={
                              index < review.score
                                ? "/images/heart/filled_heart.svg"
                                : "/images/heart/grey_heart.svg"
                            }
                            style={{ width: "24px", height: "22px" }}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm font-medium">{review.comment}</p>
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <div
                          className="h-6 w-6 rounded-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${review.user.image || "/images/profile.svg"})`,
                          }}
                        ></div>
                        <span className="text-[#3d3d3d]">{review.user.nickname}</span>
                      </div>
                      <span className="text-[#3C3C3C]">|</span>

                      <span className="text-[#9CA3AF]">
                        {formatToKoreanTime(review?.createdAt, "yyyy.MM.dd")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex w-full items-center justify-center gap-4">
              <button
                className={`flex h-6 w-6 items-center justify-center border ${page === 0 ? "invisible" : "visible"}`}
                type="button"
                onClick={handlePrevPage}
                disabled={page === 0}
              >
                <Image src="/icons/chevron_left.svg" width={22} height={22} alt="이전" />
              </button>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{page + 1}</p>
                <p className="text-[#9CA3AF]">/</p>
                <p className="text-[#9CA3AF]">{isRatingLoading || totalPages}</p>
              </div>
              <button
                className={`flex h-6 w-6 items-center justify-center border ${page >= totalPages - 1 ? "invisible" : "visible"}`}
                type="button"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
              >
                <Image src="/icons/chevron_right.svg" width={22} height={22} alt="다음" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center">
            <p className="text-[#9CA3AF]">아직 리뷰가 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}

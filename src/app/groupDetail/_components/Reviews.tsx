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

  return (
    <div className="bg-white px-4 py-6 tablet:col-span-2 tablet:px-6 tablet:pb-[87px]">
      <div className="min-h-[500px]">
        <h3 className="mb-5 text-lg font-semibold">
          리뷰 <span>{isRatingLoading || `(${totalReviews})`}</span>
        </h3>

        <div className="my-4 border-y border-[#E5E7EB]">
          {isRatingLoading ? (
            <ReviewRatingSkeleton />
          ) : ratingError ? (
            <div className="flex w-full flex-col items-center justify-center">
              <p>예기치 않은 오류가 발생했습니다. &#128549;</p>
              <p>잠시 후 다시 시도해 주세요.</p>
            </div>
          ) : (
            ratingData && (
              <ReviewRatingComponent ratingData={ratingData[0]} totalReviews={totalReviews || 0} />
            )
          )}
        </div>

        {isReviewsLoading ? (
          <div className="h-full w-full">
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </div>
        ) : reviewsError ? (
          <div className="flex w-full flex-col items-center justify-center">
            <p>예기치 않은 오류가 발생했습니다. &#128549;</p>
            <p>잠시 후 다시 시도해 주세요.</p>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div>
            <ul className="flex flex-col gap-[10px]">
              {reviews.map(review => (
                <li key={review.id} className="border-b-2 border-dashed border-[#F3F4F6] pb-4">
                  <div className="flex h-[86px] flex-col justify-between">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex h-6 w-6 items-center justify-center">
                          <Image
                            width={24}
                            height={22}
                            alt="평점 하트 이미지"
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
                          aria-label={
                            review.user.image
                              ? `${review.user.nickname} 프로필 이미지`
                              : "기본 프로필 이미지"
                          }
                        ></div>
                        <span aria-label="작성자 닉네임" className="text-[#3d3d3d]">
                          {review.user.nickname}
                        </span>
                      </div>
                      <span className="text-[#3C3C3C]">|</span>

                      <span aria-label="작성 날짜" className="text-[#9CA3AF]">
                        {formatToKoreanTime(review?.createdAt, "yyyy.MM.dd")}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex w-full items-center justify-center gap-4">
              <button
                className={`flex h-6 w-6 items-center justify-center border ${page === 0 ? "invisible" : "visible"}`}
                type="button"
                onClick={handlePrevPage}
                disabled={page === 0}
                aria-label="이전 페이지로 이동"
                aria-disabled={page === 0}
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
                aria-label="다음 페이지로 이동"
                aria-disabled={page >= totalPages - 1}
              >
                <Image src="/icons/chevron_right.svg" width={22} height={22} alt="다음" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-[200px] w-full flex-col items-center justify-center text-sm font-medium text-[#9CA3AF]">
            <p>아직 리뷰가 없어요. &#x1F4AD;</p>
            <p>첫 번째 리뷰를 기다리고 있어요!</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import { addReviews } from "@/apis/reviewsApi";
import Button from "@/components/Button/Button";
import Chip from "@/components/Chips";
import Modal from "@/components/Modal";
import Rating from "@/app/mypage/components/Rating";
import SelectRating from "@/app/mypage/components/SelectRating";
import { SkeletonCompleted, SkeletonUncompleted } from "@/app/mypage/components/Skeleton";
import useToastStore from "@/store/useToastStore";
import { AllReviewCardProps, GetMyJoinedGatheringWithReview } from "@/types/components/card";
import { formatToKoreanTime } from "@/utils/date";

export default function MyReviewCard({ review, reviewed }: AllReviewCardProps) {
  const [activeTab, setActiveTab] = useState<"uncompleted" | "completed" | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedReview, setSelectedReview] = useState<GetMyJoinedGatheringWithReview | null>(null);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const addToast = useToastStore(state => state.addToast);

  const handleOpenModal = (reviewId: GetMyJoinedGatheringWithReview) => {
    setSelectedReview(reviewId);
    setReviewText(reviewText);
    setIsModalOpen(true);
    setReviewRating(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    setReviewText("");
    setReviewRating(null);
  };

  // 리뷰 등록
  const handleSubmit = async () => {
    if (!reviewRating) {
      alert("별점을 선택해주세요.");
      return;
    }

    if (!reviewText.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      const body = {
        score: reviewRating,
        gatheringId: selectedReview,
        comment: reviewText,
      };

      await addReviews(body);
      addToast({
        message: "리뷰가 작성되었습니다.",
        type: "success",
      });
      handleCloseModal();
      forceUpdate();
    } catch (error) {
      addToast({
        message: "리뷰 작성에 실패했습니다. 다시 작성해 주세요.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <Button
            className={
              activeTab === "uncompleted"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-300 text-gray-700"
            }
            onClick={() => setActiveTab("uncompleted")}
            size="small"
          >
            작성 가능한 리뷰
          </Button>
          <Button
            className={`h-10 w-[96px] ${activeTab === "completed" ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700"}`}
            onClick={() => setActiveTab("completed")}
            size="small"
          >
            작성한 리뷰
          </Button>
        </div>

        {isLoading ? (
          activeTab === "uncompleted" ? (
            <SkeletonUncompleted />
          ) : activeTab === "completed" ? (
            <SkeletonCompleted />
          ) : null
        ) : (
          <div className="flex flex-col">
            {activeTab === "uncompleted" &&
              review?.map((reviewItem, index) => {
                const currentDate = new Date();
                const itemDateTime = new Date(reviewItem.dateTime);
                const isCompleted = itemDateTime < currentDate;

                const date = reviewItem.dateTime
                  ? formatToKoreanTime(reviewItem.dateTime, "M월 dd일")
                  : "날짜 없음";
                const time = reviewItem.dateTime
                  ? formatToKoreanTime(reviewItem.dateTime, "HH시 mm분")
                  : "시간 없음";

                return (
                  <div key={reviewItem.id} className="w-full">
                    <div className="flex w-full flex-col gap-4 tablet:flex-row">
                      <div className="relative h-[153px] w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl tablet:w-[272px]">
                        <Image
                          src={reviewItem.image}
                          fill
                          objectFit="cover"
                          alt="모임 이미지"
                          className=""
                        />
                      </div>
                      <div className="flex w-full flex-col">
                        <div className="mb-3 flex gap-2">
                          <Chip
                            type="state"
                            bgColor={isCompleted ? "bg-gray-200" : "bg-orange-100"}
                            textColor={isCompleted ? "text-gray-500" : "text-orange-primary"}
                            className="flex items-center justify-center"
                          >
                            {isCompleted ? "이용 완료" : "이용 예정"}
                          </Chip>
                          <Chip
                            type="state"
                            textColor={
                              reviewItem.participantCount >= 3
                                ? "text-orange-primary"
                                : "text-gray-400"
                            }
                            bgColor={"bg-transparent"}
                            className={`flex items-center justify-center outline outline-[1px] ${
                              reviewItem.participantCount >= 3
                                ? "outline-orange-100"
                                : "outline-gray-200"
                            }`}
                          >
                            {reviewItem.participantCount >= 3 ? "개설확정" : "개설대기"}
                          </Chip>
                        </div>
                        <div className="flex w-full gap-3">
                          <div className="mb-[18px] flex flex-col gap-1.5">
                            <span className="flex items-center gap-2 text-lg font-semibold">
                              <span className="inline-block max-w-[135px] truncate">
                                {reviewItem.name}
                              </span>
                              <span className="inline-block">|</span>
                              <span className="text-#3C3C3C inline-block max-w-[135px] truncate text-sm">
                                &nbsp;{`${reviewItem.location} ${reviewItem.address1}`}
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
                                <span className="inline-block text-sm">{`${reviewItem.participantCount}/${reviewItem.capacity}`}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-auto w-[108px]">
                          <Button
                            size="small"
                            isFilled
                            bgColor="yellow"
                            className="px-0 text-[14px] text-gray-700"
                            onClick={() => handleOpenModal(reviewItem.id)}
                          >
                            리뷰 작성하기
                          </Button>
                        </div>
                      </div>
                    </div>
                    {index !== review.length - 1 && (
                      <div className="mb-[21px] mt-[10px] border-[1.6px] border-dashed border-gray-200"></div>
                    )}
                  </div>
                );
              })}

            {activeTab === "completed" &&
              reviewed?.map((item, index) => {
                const date = item.gathering.dateTime
                  ? formatToKoreanTime(item.gathering.dateTime, "yyyy.MM.dd")
                  : "날짜 없음";

                return (
                  <div key={item.id} className="mb-6">
                    <div className="flex w-full flex-col gap-6 tablet:h-[153px] tablet:flex-row">
                      <div className="relative flex h-[153px] w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl tablet:w-[272px]">
                        <Image
                          src={
                            typeof item.gathering.image === "string"
                              ? item.gathering.image
                              : "/images/image.png"
                          }
                          fill
                          objectFit="cover"
                          alt="이미지"
                        />
                      </div>
                      <div className="flex w-full flex-col">
                        <div className="h-6 w-full">
                          <Rating score={item.score} />
                        </div>
                        <p className="mt-[10px] inline-block w-full text-sm text-gray-800">
                          {item.comment}
                        </p>
                        <span className="mt-[10px] inline-block text-xs text-gray-800">
                          {`${item.gathering.name} · ${item.gathering.location}`}
                        </span>
                        <span className="mt-2 inline-block text-xs text-gray-disable">{date}</span>
                        <div className="mt-auto hidden border-[2px] border-dashed border-gray-200 tablet:block"></div>
                      </div>
                    </div>
                    {index !== reviewed.length - 1 && (
                      <div className="mb-4 mt-5 border-[1.6px] border-dashed border-gray-200 tablet:hidden"></div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* 모달 컴포넌트 */}
        <Modal
          title="리뷰 작성하기"
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          className="w-[343px]"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-gray-900">만족스러운 경험이었나요?</h3>
              <SelectRating onChange={score => setReviewRating(score)} />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-gray-900">경험에 대해 남겨주세요.</h3>
              <textarea
                className="w-full rounded-lg bg-gray-50 p-2"
                rows={4}
                placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Button
                size="large"
                isFilled
                className="w-[228px] border border-orange-primary text-[14px] text-orange-primary"
                onClick={handleCloseModal}
              >
                취소
              </Button>
              <Button
                size="large"
                isFilled
                bgColor="yellow"
                className="w-[228px] bg-gray-disable text-[14px] text-white active:bg-gray-disable"
                onClick={handleSubmit}
              >
                리뷰 등록
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
